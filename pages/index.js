import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
import { NextUIProvider, Table, Container, Card, Text, Badge, Link, Image, Loading } from '@nextui-org/react';
import ReactGA from 'react-ga4';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from './config.json';

const firebaseConfig = {
  apiKey: "AIzaSyBxnplTgab7KNB6XFPrVypDc8fS3Fz8wMU",
  authDomain: "arbitrage-vercel.firebaseapp.com",
  projectId: "arbitrage-vercel",
  storageBucket: "arbitrage-vercel.appspot.com",
  messagingSenderId: "539721601315",
  appId: "1:539721601315:web:47ea8688da38f34f94fc96",
  measurementId: "G-8ZN91TDH17"
};


export default function Home() {

  const [priceData, setPriceData] = useState(null);
  const [width, setWidth] = useState(0);
  let scrips = [];

  config.data.map((merger) => {
      if (scrips.indexOf(merger.scrip1) == -1) {
        scrips.push(merger.scrip1);
      }
      if (scrips.indexOf(merger.scrip2) == -1) {
        scrips.push(merger.scrip2)
      }
  })


  React.useEffect(() => {
    setWidth(window.innerWidth);
    
    fetch('https://api.dalalstreet.pro/getQuote?api_key=CssgK3JQNenGzU6aDTr6w6g5S&symbols='+scrips.join(","))
      .then((response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      }))
      .then(data => {

        let price = [];

        data.map((d) => {
          price[d.scrip] = {
            scrip: d.scrip,
            ltp: d.price,
            name: d.name
          }
        });

        setPriceData(price);
      })


    ReactGA.initialize('G-Q5V6YP2Y0C');

    ReactGA.send({ hitType: "pageview", page: "/", title: "Arbitrage Opportunities" });

    const app = initializeApp(firebaseConfig);
    getAnalytics(app);

  }, []);

  return (
    <NextUIProvider>
      <Container css={{ backgroundColor: '#1d2027', minWidth: '100vw' }} fluid>
        <Head>
          <title>Arbitrage Ideas</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=450" />
        </Head>

        <Text
          size={(width > 500) ? 60 : 30}
          css={{
            textGradient: "45deg, $blue600 40%, $pink600 60%",
            textAlign: 'center',
            padding: (width > 500) ? '80px' : '30px'
          }}
          weight="bold"
        >
          Arbitrage Opportunities
        </Text>

        <Card variant="flat" css={{ maxWidth: '1200px', margin: 'auto' }}>
          
          {priceData && <Table
            aria-label="Example table with static content"
            css={{
              height: "auto",
            }}
          >
            <Table.Header>
              <Table.Column>Company 1</Table.Column>
              <Table.Column>Company 2</Table.Column>
              <Table.Column>Ratio</Table.Column>
              <Table.Column>Difference</Table.Column>
              <Table.Column>Source</Table.Column>
            </Table.Header>
            <Table.Body>
              {config.data.map((merger,id) => {
                  let difference = null;
                  if(priceData[merger.scrip1]) {
                    const cost1 = priceData[merger.scrip1].ltp * merger.ratio1; // 
                    const cost2 = priceData[merger.scrip2].ltp * merger.ratio2;
                    difference = (cost1 - cost2)/cost2*100;
                  }
                  return (
                    <Table.Row key={id}>
                      <Table.Cell>{merger.scrip1} {(width > 500) && <span style={{ fontSize: '12px', fontWeight: '400', color: '#aaa' }}>({priceData[merger.scrip1]?.name})</span>} {(width > 500) && <Text weight="bold">{priceData[merger.scrip1]?.ltp}</Text>}</Table.Cell>
                      <Table.Cell>{merger.scrip2} {(width > 500) && <span style={{ fontSize: '12px', fontWeight: '400', color: '#aaa' }}>({priceData[merger.scrip2]?.name})</span>} {(width > 500) && <Text weight="bold">{priceData[merger.scrip2]?.ltp}</Text>}</Table.Cell>
                      <Table.Cell>{merger.ratio1}:{merger.ratio2}</Table.Cell>
                      <Table.Cell><Badge color={(difference > 0) ? "success" : "error"} variant="bordered">{Math.round(difference*100)/100}%</Badge></Table.Cell>
                      <Table.Cell>
                        <Link href={merger.source} target="_blank">
                          <Badge size="sm">Link</Badge>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              }
            </Table.Body>
          </Table>}

          {priceData || <Loading css={{ margin: '200px' }} size="xl" />}
        </Card>

        <Container css={{ maxWidth: '1200px', margin: 'auto' }}>
          <Text size="$md" color='#888'>
            * Based on Corporate Actions proposed by the company
          </Text>


          <Text
            h3
            css={{
              textGradient: "45deg, $blue600 -40%, $pink600 20%",
              paddingTop: '80px',
              paddingBottom: '10px'
            }}
            weight="bold"
          >
            Notes
          </Text>


          <Text size="$md" color='#bbb'>
            - It is for Educational Purpose only, Not an Investment advice
            <br/>
            - Merger might take more time than expected. But, Ratio won't change.
            <br/>
            - The difference means that you can buy company in discount by purchasing the company which is going to be merged
            <br/>
            - If you own the Company 1 for long term, You can consider selling the Company 1 and buy the company 2 to get the arbitrage benefits.
            <br/>
            - Do your own due diligence and make the investment.
            <br/>
            - If you like to contribute or give feedback, Please feel free to contact me at <Link href="mailto:hi@sriraman.dev">hi@sriraman.dev</Link>
          </Text>

            <Image
              width={300}
              height={300}
              src="./madebysri2.png"
              css={{ filter: 'invert(93%) sepia(3%) saturate(427%) hue-rotate(161deg) brightness(84%) contrast(91%)', rotate: '330deg', padding: 60 }}
            />
          
        </Container>
      </Container>
    </NextUIProvider>
  )
}
