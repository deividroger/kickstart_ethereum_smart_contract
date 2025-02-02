import React, { Component } from 'react'
import Layout from '../../../components/Layout'
import { Button, Table } from 'semantic-ui-react'
import {Link } from '../../../routes'
import  Campaign from '../../../ethereum/campaign'
import RequestRow from '../../../components/RequestRow'
class RequestIndex extends Component {
   
    componentDidMount() {
        window.ethereum.enable();
    }

    static async getInitialProps(props) {
        
        const {address} =props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount =  parseInt( ( await campaign.methods.getSummary().call())[3],10).toString();

        console.log(approversCount);

        const requests = await Promise.all(
           Array(parseInt(requestCount,10)).fill().map((element,index)=>{
                return campaign.methods.requests(index).call()
           })
        );
        return {address,requests, requestCount,  approversCount};
    }

renderRows() {
    return this.props.requests.map((request,index) =>{
        return <RequestRow 
            request={request} 
            key={index} 
            id={index} 
            address={this.props.address} 
            approversCount ={this.props.approversCount}
            />
    });
}

    render() {
        const {Header,Row, HeaderCell,Body} = Table;

        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                <Button primary floated='right' style={{ marginBottom:10} }  >Add Request</Button>
                </Link>

                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>
                    Found {parseInt( this.props.requestCount,10)} requests.
                </div>
            </Layout>

        )
    }
}

export default RequestIndex;