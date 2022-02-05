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
class WalletObject extends React.Component{
  constructor () {
    super();
    this.state = {
      emps:[ new Wallet(1,'Metamask','/metamask.png'),new Wallet(2,'WalletConnect','/wallet-connect.svg'),new Wallet(3,'Keystone','/keystone.png'),new Wallet(4,'Lattice','/lattice.png'),new Wallet(5,'Coinbase Wallet','/coinbase.svg'),new Wallet(6,'Fortmatic','/fortmatic.png'),
      new Wallet(7,'Portis','/portis.png'),new Wallet(8,'Torus','/torus.png'),new Wallet(9,'Binance','/bsc.jpg'),new Wallet(10,'Clover','/clover.svg'),]
    }
  }
  render(){const listItems = this.state.emps.map((item) => <Button className={styles.btnprimary} key={item.id}><img className={styles.avatarImage} src={item.href} alt="wallet image"></img><span className={styles.walletName}>{item.name}</span></Button>);
  return(<ul>{listItems}</ul>)
}
}

export default function Home() {
const {active,account,library,connector,activate,deactivate,chainId,error}  =  useWeb3React()
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
<Table className={styles.tblcontainer,styles.bdr} striped bordered hover size ="sm">  
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
//function to generated the modal in which the wallets buttons are :
function MydModalWithGrid(props) {
  return ( 
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select your wallet:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.FlexWrap}>
          {WalletNumberOfRows(5)}
      </Modal.Body>
      <Modal.Footer>
        {/* {active? } */}
      {active? <Button onClick={disconnectInjected}>Disconnect</Button>:""}
      <Button onClick={connectInjected}>
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
      <Button variant="primary" onClick={() => setModalShow(true)}>
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
  <Row></Row>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>       
          </main>
        </div>
    )
}

