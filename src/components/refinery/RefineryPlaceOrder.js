import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { useCallback,useRef} from 'react';
import { FireFly, } from '../../firefly';
import ReconnectingWebsocket from 'reconnecting-websocket';
import dayjs from 'dayjs';
import uuid from 'react-uuid';

const MEMBERS = [
    'http://localhost:5000',
    'http://localhost:5001',
];

const MAX_MESSAGES = 25;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const RefineryPlaceOrder=()=> {

    // const additionalDetails = useSelector(
    //     (state) => state.AdditionalDetails.additionalDetails
    //   );
    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
    //   const [pid,setPid] = useState('');
      const [rate,setRate] = useState(63.45);
      const [details, setDetails] = useState({
        productId: uuid(),
        product: "1G ETHANOL",
        productType:"",
        quantity:200,
        price:200*rate,
        sender:userData._id,
        receiver:"",
        senderType:userData.type,
        receiverType:""
   })
   const handleChange = (e) => {
       e.preventDefault();
       const name = e.target.name;
       const value = e.target.value;
   
       setDetails({ ...details, [name]: value });
     };
   const classes = useStyles();
   const [products, setProducts] = useState([]);
   const [messages, setMessages] = useState([]);
   const [messageText, setMessageText] = useState(userData.deliveryaddress);
   const [selectedMember, setSelectedMember] = useState(0);
   const firefly = useRef(null);
   const ws = useRef(null);
   const [isPrivate, setIsPrivate] = useState(false);
   const [orgs, setOrgs] = useState([]);
   const [pickedOrgs, setPickedOrgs] = useState({});
   const [selfOrg, setSelfOrg] = useState('');
   const [confirmationMessage, setConfirmationMessage] = useState('');
   const arr = [];
   const load = useCallback(async () => {
       const host = MEMBERS[selectedMember];
       console.log(`Loading data from ${host}`);
       firefly.current = new FireFly(host);
       const messages = await firefly.current.getMessages(MAX_MESSAGES);
       const rows = [];
       for (const message of messages) {
           rows.push({
               message,
               data: await firefly.current.retrieveData(message.data),
           });
       }
       setMessages(rows);
       const orgs = await firefly.current.getOrgs();
       setOrgs(orgs);
       const status = await firefly.current.getStatus();
       setSelfOrg(status?.org?.name || '');
       const wsHost = MEMBERS[selectedMember].replace('http', 'ws');
       if (ws.current !== null) {
           ws.current.close();
       }
       ws.current = new ReconnectingWebsocket(`${wsHost}/ws?namespace=default&ephemeral&autoack`);
       ws.current.onopen = () => {
           console.log('Websocket connected');
       };
       ws.current.onmessage = (message) => {
           const data = JSON.parse(message.data);
           if (data.type === 'message_confirmed') {
               load();
           }
       };
       ws.current.onerror = (err) => {
           console.error(err);
       };
   }, [selectedMember]);
   const orgName = (message) => {
       const identity = message.message.header.author;
       const org = orgs?.find((o) => o.identity === identity);
       let name = org ? org.name : identity;
       if (message.message.local) {
           name = `${name} (self)`;
       }
       return name;
   };
   const MessageList = (options) => {
       const { messages } = options;
       const classes = useStyles();
       const rows = [];
       for (const message of messages) {
           const date = dayjs(message.message.header.created);
           rows.push(<TableRow key={message.message.header.id}>
         <TableCell>{date.format(DATE_FORMAT)}</TableCell>
         <TableCell>{orgName(message)}</TableCell>
         <TableCell className={classes.scrollRight}>
           <div>
             {/* <pre>
               {message.data
                   .map((d) => JSON.stringify(d?.value || '', null, 2))
                   .join(', ')}
             </pre> */}
             <pre>
               {message.data
                   .map((d) => {if(d){
                       const obj = JSON.stringify(d.value)
                       const x = d.value.details?d.value.details:"";
                       if(x!="")
                       {
                           arr.push(message)
                       }
                       return(
                       <div>
                           {/* <div>{d.value.details.map((x)=>{
                               return(
                                   <div>
                                       {x}
                                   </div>
                               )
                           })}</div> */}
                           {/* <div>{JSON.stringify(d.value.messageText)}</div> */}
                           <div>{message.message.header.id}</div>
                            <div>{x.product}</div>
                            <div>{x.type}</div>
                            <div>{x.quantity}</div>
                            <div>{x.price}</div>
                            <div>{x.sender}</div>
                            <div>{x.receiver}</div>
                       </div>
                   )}
                   setProducts(arr);})}
             </pre>
           </div>
         </TableCell>
       </TableRow>);
       }
       return (<Table>
       <TableHead>
         <TableRow>
           <TableCell>Time</TableCell>
           <TableCell>From</TableCell>
           <TableCell>Data</TableCell>
         </TableRow>
       </TableHead>
       <TableBody>{rows}</TableBody>
     </Table>);
   };

   useEffect(() => {
     if (!userData.accessToken || userData.type!="Refinery") {
       navigate('/login');
     }
   }, [userData, navigate]);
   
   useEffect(() => {
       load();
       console.log(details);
   }, [load]);
   
   useEffect(()=>{
    if(details.product==="1G ETHANOL")
    {
         setRate(63.5)
        details.receiverType = "ETHANOL PRODUCER";
    }
    else{
        setRate(70)
        details.receiverType = "BIOMASS UNIT";
    }
   })
  return (
    <div className={`${classes.root} d-flex flex-column align-items-center`}>

        <div>{details.senderType}: {userData.name}</div>
        <div>{details.sender}</div>
        <div>Product ID: <span className='text-danger'>{details.productId}</span></div>
        <form className='form d-flex flex-column align-items-start'>
        {/* {
            Questions.map((ques)=>{
              return(
                <div className="field" id={ques.question}>
                <span>{ques.id}</span>
                <label>{ques.question}</label>
                <input type={ques.type} name = {ques.name} value={ques.value} onChange={handleChange} />
                <a href={ques.urlP}>Prev</a>
                <a href={ques.urlN}>Next</a>
                </div>
              )
            })
          } */}
        <div className='field' id='product'>
          <label className='question mx-5 my-2'>
            Product <span className='mandatory'>*</span>
          </label>
          <select
            className={`p-2 border-none`}
            name='product'
            value={details.product}
            onChange={handleChange}
          >
            <option>1G ETHANOL</option>
            <option>2G ETHANOL</option>
          </select>
          {/* <input
            type='text'
            placeholder='Type your answer here...'
            name='product'
            value={details.product}
            onChange={handleChange}
          /> */}
        </div>
        <div className=' mx-5 my-2'>Rate: {rate} /L</div>
        <div className=' mx-5 my-2'>Price: {rate*details.quantity} INR</div>

        {/* <div className='field' id='type'>
          <span className='index'>Q2.</span>
          <label className='question'>
            Type <span className='mandatory'>*</span>
          </label>
          <input
            type='text'
            placeholder='Type your answer here...'
            name='type'
            value={details.productType}
            onChange={handleChange}
          />
        </div> */}

        <div className='field' id='quantity'>
          <label className='question  mx-5 my-2'>
            Quantity <span className='mandatory'>*</span>
          </label>
          <input
            type='text'
            placeholder='Type your answer here...'
            name='quantity'
            value={details.quantity}
            onChange={handleChange}
          /> L
        </div>

        <div className='field' id='receiver'>
          <label className='question  mx-5 my-2'>
            {details.receiverType} ID <span className='mandatory'>*</span>
          </label>
          <input
            type='text'
            placeholder='Type your answer here...'
            name='receiver'
            value={details.receiver}
            onChange={handleChange}
          />
        </div>

      </form>
      <Grid container spacing={3}>
        <Grid item xs={1} md={2} xl={3}/>
        <Grid item xs={10} md={8} xl={6}>
          <Paper className={classes.paper} component="form" onSubmit={async (event) => {
            event.preventDefault();
            try {
                if (messageText === '') {
                    return;
                }
                if (isPrivate) {
                    const recipients = [];
                    pickedOrgs[selfOrg] = true;
                    for (const oName in pickedOrgs) {
                        if (pickedOrgs[oName]) {
                            recipients.push({ identity: oName });
                        }
                    }
                    await firefly.current?.sendPrivate({
                        data: [
                            {
                                value: messageText,
                            },
                        ],
                        group: {
                            members: recipients,
                        },
                    });
                }
                else {
                    setDetails({...details,messageText});
                    await firefly.current?.sendBroadcast([
                        {
                            
                            value: {details:details,messageText}
                        },
                    ]);
                }
                setConfirmationMessage('Message sent');
            }
            catch (err) {
                setConfirmationMessage(`Error: ${err}`);
            }
            setMessageText('');
        }}>

            <FormControlLabel control={<Switch checked={!isPrivate} color="primary" onClick={() => setIsPrivate(!isPrivate)}/>} label={isPrivate
            ? 'Choose recipients'
            : 'Broadcast to the whole network'} className={`${classes.formControl} d-none`}/>
            {isPrivate && (<Box>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Pick recipients</FormLabel>
                  <FormGroup>
                    {orgs.map((o, i) => (<FormControlLabel key={o.name} control={<Checkbox checked={!!pickedOrgs[o.name] || o.name === selfOrg} disabled={o.name === selfOrg} onChange={(e) => {
                        console.log(e.target);
                        setPickedOrgs({
                            ...pickedOrgs,
                            [e.target.value]: e.target.checked,
                        });
                    }} name={o.name} value={o.name}/>} label={o.name === selfOrg
                    ? `${o.name}/${o.identity} (self)`
                    : `${o.name}/${o.identity}`}/>))}
                  </FormGroup>
                </FormControl>
              </Box>)}

            <FormControl className={classes.formControl} fullWidth={true}>
              <TextField label="Message" variant="outlined" value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
            </FormControl>

            <FormControl className={classes.formControlRight}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </FormControl>

            <div className={classes.clearFix}/>
          </Paper>

          <br />

          <Paper className={classes.paper}>
            <h1>Last {MAX_MESSAGES} Messages Received</h1>

            <MessageList messages={messages}/>
          </Paper>
        </Grid>
        <Grid item xs={1} md={2} xl={3}>
          <FormControl style={{ float: 'right' }}>
            <Select value={selectedMember} onChange={(event) => {
            console.log(`Set selected member ${event.target.value}`);
            setSelectedMember(event.target.value);
        }}>
              {MEMBERS.map((m, i) => (<MenuItem key={m} value={i}>
                  {m}
                </MenuItem>))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs/>
      </Grid>
      {/* <Product val = {products} /> */}
      <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }} open={!!confirmationMessage} autoHideDuration={3000} message={confirmationMessage} onClose={() => setConfirmationMessage('')}/>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
    },
    formControl: {
        marginTop: theme.spacing(2),
    },
    formControlRight: {
        marginTop: theme.spacing(2),
        float: 'right',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    upload: {
        display: 'none',
    },
    clearFix: {
        clear: 'both',
    },
    scrollRight: {
        overflowX: 'scroll',
        [theme.breakpoints.up('xs')]: {
            maxWidth: 150,
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: 350,
        },
        [theme.breakpoints.up('xl')]: {
            maxWidth: 450,
        },
    },
}));

export default RefineryPlaceOrder;