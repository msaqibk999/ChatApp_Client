import React,{useState, useEffect, useRef} from 'react'
import styles from '../cssModules/ChatBox.module.css'
import LoginModal from './LoginModal';
import { requestPermission } from '../firebase';

 const ws = new WebSocket("wss://chatappserver1.onrender.com/cable");


export default function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [me, setMe] = useState("");
    const [guid, setGuid] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesContainerRef = useRef();

     const messagesUrl = "https://chatappserver1.onrender.com/messages";


    useEffect( ()=> {
        const me = localStorage.getItem('myPhoneNumber')
        if(me && me.length === 10) {
            setMe(me);
            fetchMessages();
        }
        else {
            setTimeout(() => {
                setLoading(false);
            }, 1300);
        }
    },[])

    useEffect( () => {
        resetAndScroll();
    },[messages, loading])

    const fetchMessages = async() => {
        const response = await fetch(messagesUrl);
        const data = await response.json();
        setMessagesAndScrollDown(data);
        setTimeout(() => {
            setLoading(false);
            requestPermission();
        }, 1300);
    }

    const pull_data = (data) => {
        setMe(data);
        fetchMessages();
    }

    const setMessagesAndScrollDown = (data) => {
        setMessages(data);
        resetAndScroll();
    }

    const resetAndScroll = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const calculateTime = (data) => {
        const date = new Date(data);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = (hours % 12) || 12;
        const formattedMinutes = minutes.toString().padStart(2, "0");
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    ws.onopen = () => {
        console.log("connected to websocket server");
        setGuid(Math.random().toString(36).substring(2,15));

        ws.send(
            JSON.stringify({
                command: "subscribe",
                identifier: JSON.stringify({
                    id: guid,
                    channel: "MessagesChannel",
                }),
            })
        );
    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === "ping") return;
        if(data.type === "welcome") return;
        if(data.type === "confirm_subscription") return;

        const message = data.message;
        setMessagesAndScrollDown([ ...messages, message]);
        if (Notification.permission === "granted" && document.visibilityState !== "visible" && message.sender !== me) {
            
          }
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }

    const handleSubmit = async () => {
        const inputElement = document.querySelector("#inputMessage");
        const input = inputElement.value.toString().trim();
        if(input.length === 0) window.alert("please input a message first");
        else{
            const response = await fetch( messagesUrl , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: me,
                    body: input,
                })
            });
            if(response.status === 201){
                inputElement.value = '';
            }
            else{
                console.log(response.statusText);
            }
        }
    }

  return (
    <div className={styles.mainContainer}>
        <div className={styles.chatHeading}>ChatRoom</div>
        <div className={styles.slideInContainer}>

        </div>
        <div className={styles.chatContainer}>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.logoContainer}>
                        <img 
                        src='https://cdn3d.iconscout.com/3d/premium/thumb/chat-talking-5143250-4312620.png'
                        alt='logo'
                        className={styles.logoImg}
                        />
                    </div>
                    <div className={styles.loader}></div>
                </div>
            ):
            me ? (
                <div>
                <div className={styles.prevMessagesContainer} ref={messagesContainerRef}>
                    {messages.length > 0 ? (
                         messages.map((item, index) => (
                             <div key={index} className={`${styles.prevMessages} ${item.sender === me ? styles.alignRight : styles.alignLeft}`}>
                                 <div key={item.id} className={styles.messageBody}>
                                     <div className={styles.sender}>~{item.sender}</div>
                                     <div className={styles.message}>{item.body}</div>
                                     <div className={styles.messageTime}>{item.created_at ? calculateTime(item.created_at) : calculateTime(item.time)}</div>
                                 </div>    
                             </div>
                         ))
                    ):(
                         <div className={styles.noMessage}>
                             Send a message to start a conversation
                         </div>
                    )}
                    
                </div>
                <div className={styles.messageContainer}>
                    <input type="text" id='inputMessage' placeholder='Message' className={styles.messageInput} onKeyDown={handleKeyPress}/>
                    <button className={styles.sendButton} onClick={handleSubmit}> send </button>
                </div>
            </div>
            ):(
                <div className={styles.noMessage}>
                   <strong>Please login to enter conversation</strong> 
                    <LoginModal func = {pull_data}/>
                </div>
            )
            }
        
        </div>
    </div>
  )
}
