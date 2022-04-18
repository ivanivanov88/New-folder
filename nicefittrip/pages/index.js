import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {injected,network,walletconnect,walletlink,ledger,trezor,frame,fortmatic,portis,squarelink,torus,authereum} from "../components/wallet/connectors";
import {NoEthereumProviderError,UserRejectedRequestError as UserRejectedRequestErrorInjected} from "@web3-react/injected-connector";
import {URI_AVAILABLE,UserRejectedRequestError as UserRejectedRequestErrorWalletConnect}from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { Container } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Wallet } from './api/hello';
import {Table} from "react-bootstrap";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Web3ReactProvider,useWeb3React,UnsupportedChainIdError} from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "../components/wallet/hooks";
import { Spinner } from "./Spinner";

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}
const connectorsByName = [
  {name : 'Injected', connector : injected, img:'/metamask.png'},
  {name : 'Network', connector : network, img:'/wallet-connect.svg'},
  {name : 'WalletConnect', connector : walletconnect, img:'/keystone.png'},
  {name : 'WalletLink', connector : walletlink,img:''},
  {name : 'Ledger', connector : ledger , img: '/lattice.png'},
  {name : 'Trezor', connector : trezor, img:'/coinbase.svg'},
  {name : 'Frame', connector : frame, img:'/bsc.jpg'},
  {name : 'Fortmatic', connector: fortmatic, img: ''},
  {name : 'Portis', connector : portis,img:''},
  {name : 'Squarelink', connector : squarelink,img:''},
  {name : 'Torus', connector : torus, img: '/torus.png'},
  {name : 'Authereum', connector : authereum, img:''}
];
export default function MyApp() {
      const context = useWeb3React();
         const {
           connector,
           library,
           chainId,
           account,
           activate,
           deactivate,
           active,
           error
         } = context;
                 // handle logic to recognize the connector currently being activated
         const [activatingConnector, setActivatingConnector] = React.useState();
         React.useEffect(() => {
           console.log('running')
           if (activatingConnector && activatingConnector === connector) {
             setActivatingConnector(undefined);
           }
         }, [activatingConnector, connector]);
        // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
           const triedEager = useEagerConnect();
          // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
          useInactiveListener(!triedEager || !!activatingConnector);
          // set up block listener
          const [blockNumber, setBlockNumber] = React.useState();
          React.useEffect(() => {
          console.log('running')
          if (library && account && active) {
            let stale = false;
            console.log('fetching block number!!')
            library.getBlockNumber().then(blockNumber => {
                if (!stale) {
                  setBlockNumber(blockNumber);
                }
              })
              .catch(() => {
                if (!stale) {
                  setBlockNumber(null);
                }
              });
       
            const updateBlockNumber = blockNumber => {
              setBlockNumber(blockNumber);
            };
            library.on("block", updateBlockNumber);       
            return () => {
              library.removeListener("block", updateBlockNumber);
              stale = true;
              setBlockNumber(undefined);
            };
          }
       }, [library, chainId]);
       const [ethBalance, setEthBalance] = React.useState();
       React.useEffect(() => {
       console.log('running')
       if (library && account) {
         let stale = false;
           library
           .getBalance(account)
           .then(balance => {
             if (!stale) {
               setEthBalance(balance);
             }
           })
           .catch(() => {
             if (!stale) {
               setEthBalance(null);
             }
           });   
         return () => {
           stale = true;
           setEthBalance(undefined);
         };
       }
     }, [library, account, chainId]);
       // log the walletconnect URI
     React.useEffect(() => {
       console.log('running')
       const logURI = uri => {
         console.log("WalletConnect URI", uri);
       };
       walletconnect.on(URI_AVAILABLE, logURI);
       return () => {
         walletconnect.off(URI_AVAILABLE, logURI);
       };
     }, []);  
          async function connectInjected(){
            try {
              await activate(injected)
            }
            catch(ex){
              console.log(ex)
            }
          }
          async function disconnectInjected(){
            try {
              deactivate(injected)
            }
            catch(ex){
              console.log(ex)
            }
          }
        function CheckStateOfConnectedWallet(){
            const[activatingConnector, setActivatingConnector] = React.useState();
            React.useEffect(()=>{console.log('running')
            if(activatingConnector && activatingConnector === connector){
            setActivatingConnector(undefined);
            }
           },[activatingConnector,connector]);
           const triedEager=useEagerConnect();
           useInactiveListener(!triedEager || !!activatingConnector);
          }
          function WalletNumberOfRows(numrows){
            for (var i = 0; i < numrows; i++){
              return(
               <WalletObject></WalletObject>
              )
            } 
          }
          function ShowParameters(active){
            if(active){
              return(
              <h3
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr min-content 1fr",
          maxWidth: "20rem",
          lineHeight: "2rem",
          margin: "auto"
        }}
      >
        <span>Chain Id</span>
        <span role="img" aria-label="chain">
          ⛓
        </span>
        <span>{chainId === undefined ? "..." : chainId}</span>

        <span>Block Number</span>
        <span role="img" aria-label="numbers">
          🔢
        </span>
        <span>
          {blockNumber === undefined
            ? "..."
            : blockNumber === null
            ? "Error"
            : blockNumber.toLocaleString()}
        </span>

        <span>Account</span>
        <span role="img" aria-label="robot">
          🤖
        </span>
        <span>
          {account === undefined
            ? "..."
            : account === null
            ? "None"
            : `${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
        </span>

        <span>Balance</span>
        <span role="img" aria-label="gold">
          💰
        </span>
        <span>
          {ethBalance === undefined
            ? "..."
            : ethBalance === null
            ? "Error"
            : `Ξ${parseFloat(formatEther(ethBalance)).toPrecision(4)}`}
        </span>
      </h3>)
      }
      else return false
          }
        //function to generate a table with rows and columns. Will be called twice with properties depending on the sex parameter
         function nftTable(tableName,cols,numrows,sex)
         {  let multipleRows =[];
           if(sex=="male"){
             let oneRow = 
               {active} ? <><td></td><td></td><td>{account}</td><td></td></> : null
           multipleRows.push({oneRow});
           for (let i = 0; i < numrows; i++){
            oneRow = <><td>{i}</td><td></td><td></td><td></td></>
            multipleRows.push({oneRow});
           } 
         }
         if(sex=="female"){
           let oneRow = 
             {active} ? <><td></td><td></td><td>{account}</td><td></td></> : null
         multipleRows.push({oneRow});
         for (let i = 0; i < numrows; i++){
          oneRow = <><td>{i}</td><td></td><td></td><td></td></>
          multipleRows.push({oneRow});
         } 
       }
    return(
           <Table className={styles.tblcontainer , styles.bdr} striped bordered hover size ="sm">  
           <thead className={styles.bggreen}>
             <tr>
             <th>#</th>
             <th>Avatar</th>
             <th>Wallet Address</th>
             <th>Bid</th>
             </tr>
           </thead>
           <tbody> 
           {multipleRows.map(multipleRows => <tr>{multipleRows.oneRow}</tr>)}
           </tbody>
          </Table>)
      }
      function ButtonToConnect(buttonProps){
        const currentButton = buttonProps.buttonProps.map((connector) => {     
        const currentButtonName = connector.connector ;            
        const activating = currentButtonName === activatingConnector;
        const connected = currentButtonName === connector;    
        const disabled =
        !triedEager || !!activatingConnector || connected || !!error;                                 
        return (<button
        style={{
          height: "3rem",
          borderRadius: "1rem",
          borderColor: activating
            ? "orange"
            : connected
            ? "green"
            : "unset",
          cursor: disabled ? "unset" : "pointer",
          position: "relative",
          
        }}
        disabled={disabled}
        key={connector.name}
        onClick={() => {
          setActivatingConnector(currentButtonName);
          activate(connector.connector);
        }}        
      >
        <img src={ connector.img}></img>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",
            display: "flex",
            alignItems: "center",
            color: "black",
            margin: "0 0 0 1rem"
          }}
        >
          {activating && (
            <Spinner
              color={"black"}
              style={{ height: "25%", marginLeft: "-1rem" }}
            />
          )}
          {connected && (
            <span role="img" aria-label="check">
              ✅
            </span>
          )}
        </div>
        {connector.name}
      </button>);
     })
    return (currentButton.map((button) =>(button)))
    }
//function to generated the modal in which the wallets buttons are :
function MydModalWithGrid(props) { 
  // ButtonToConnect(connectorsByName);
  return ( 
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {active? 'Parameters' : 'Select your wallet:'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.FlexWrap}>
          {active? ShowParameters(active) : 
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>} 
          <ButtonToConnect buttonProps = {connectorsByName} />
      </Modal.Body>
      <Modal.Footer>
      <span>
          {account === undefined
            ? "..."
            : account === null
            ? "None"
            : `${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
        </span>
      {active? <Button onClick={disconnectInjected}>Disconnect</Button>:""}
      <Button  onClick={connectInjected}>
                Connect to wallet
      </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
            }
//function to show and hide the modal  trough buttons clicks
  function ShowHideModal() {
    const [modalShow, setModalShow] = React.useState(false);
    return (
      <>
        <Button variant="primary" className={styles.btnprimaryNoPadding} onClick={() => setModalShow(true)}>
          {active?<div className={styles.text}>{account}<span title={account} className={ styles.tooltiptext}>{account}</span></div>:"Choose a Wallet:"}
        </Button>
        <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }
  return (
    <div className={styles.container}>
      <Head>
       <meta name="description" content="Generated by create next app" />
       <link rel="icon" href="/favicon.ico" />
       <meta charset="utf-8"/>
       <meta name="viewport" content="width=device-width, initial-scale=1"/>
       <link href="style.css" rel="stylesheet"/>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"/>
       <title>NiceFitTrip</title>
      </Head>
        <main>
          <Navbar bg="light" expand="lg">
            <Container fluid>
              <Navbar.Brand href="#">NiceFitTrip</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                 <Navbar.Collapse id="navbarScroll">
                  <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll>
                    <Nav.Link href="#action1">Home</Nav.Link>
                    <Nav.Link href="#action2">Map</Nav.Link>
                    <NavDropdown title="Link" id="navbarScrollingDropdown">
                      <NavDropdown.Item href="#action3">Meeting</NavDropdown.Item>
                      <NavDropdown.Item href="#action4">Current meet match</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#action5">
                        Where is current match?
                      </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#" disabled>
                      Link
                    </Nav.Link>
                  </Nav>
        <Form className="d-flex">
         <FormControl
          type="search"
          placeholder="Search by wallet address:"
          className="me-2"
          aria-label="Search"
        />
        <Button className='me-2' variant="outline-success">Search</Button>
         {ShowHideModal()}
      <h1 style={{ margin: "0", textAlign: "right" }}>
        {active ? "🟢" : error ? "🔴" : "🟠"}
      </h1>
       </Form>
     </Navbar.Collapse>          
    </Container>
  </Navbar>
  <Row className={styles.tableRow}>
  <Col>
  {nftTable(null,null,6,"male")}
  </Col> 
   <Col>
  {nftTable(null,null,6,"female")}
  </Col>  
  </Row>
  <Row>
  <span>
          {ethBalance === undefined
            ? "..."
            : ethBalance === null
            ? "Error"
            : `Ξ${parseFloat(formatEther(ethBalance)).toPrecision(4)}`}
        </span>
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {(active || error) && (
          <button
            style={{
              height: "3rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              borderColor: "red",
              cursor: "pointer"
            }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>
  </Row>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>       
          </main>
        </div>
    )
}

