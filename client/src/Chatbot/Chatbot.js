import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Sections/Message';
import { List, Icon, Avatar } from 'antd';
import Card from "./Sections/Card";


function Chatbot() {
    const dispatch = useDispatch();
    const messagesFromRedux = useSelector(state => state.message.messages) //8.//

    useEffect(() => { //사이트들어올때마다 실행.트리거.dialogFlow Indent임
        eventQuery('welcometoMyChatbot') //7.//
    }, [])

    const textQuery = async (text) => {
        //첫번쨰    
        let conversation = {
            who: 'user',
            content: {
                text: {
                    text: text
                }
            }
        }

        dispatch(saveMessage(conversation))
         console.log('text I sent', conversation)

        //두번쨰 
        const textQueryVariables = {
            text
        }
        try {
            //라우터로...
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)
            for (let content of response.data.fulfillmentMessages) { //첫번쨰와같은양식, response부분
                conversation = {
                    who: 'bot',
                    content: content
                }
                dispatch(saveMessage(conversation))
            }
        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "😢 Error from TextQuery 😢"
                    } 
                }
            }
            dispatch(saveMessage(conversation))
        }
    }


    const eventQuery = async (event) => {

        // conversaion필요업고..
        const eventQueryVariables = {
            event
        }
        try {
            //라우터로보냄
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            for (let content of response.data.fulfillmentMessages) {

                let conversation = {
                    who: 'bot',
                    content: content
                }

                dispatch(saveMessage(conversation))
            }

        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }

    }


    const keyPressHanlder = (e) => {
        if (e.key === "Enter") {
            if (!e.target.value) {
                return alert('you need to type somthing first')
            }
            textQuery(e.target.value) //6.//라우터로보냄 
            e.target.value = "";
        }
    }

    const renderCards = (cards) => {
        //10. 카드가 3개라서.. //
        return cards.map((card,i) => <Card key={i} cardInfo={card.structValue} />)
    }


    const renderOneMessage = (message, i) => { //8.//
        console.log('message', message,'~~', i)


        // 보통txt로
        if (message.content && message.content.text && message.content.text.text) {
            return <Message key={i} who={message.who} text={message.content.text.text} /> //9.// 
        } 
        // 카드로 응답
        else if (message.content && message.content.payload.fields.card) {

            const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />

            return <div>
                <List.Item style={{ padding: '1rem' }}>
                    <List.Item.Meta
                        avatar={<Avatar icon={AvatarSrc} />}
                        title={message.who}
                        //10. 카드가 3개라서..//
                        description={renderCards(message.content.payload.fields.card.listValue.values)}
                    />
                </List.Item>
            </div>
        }

        

    }

    const renderMessage = (returnedMessages) => { //8.//

        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i); //8.// 
            })
        } else {
            return null;
        }
    }

    //4.//
    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>
                {renderMessage(messagesFromRedux)}   //8.//
            </div>
            <input
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHanlder} //5.//
                type="text"
            />

        </div>
    )
}

export default Chatbot;
