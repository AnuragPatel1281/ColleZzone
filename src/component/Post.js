import { Avatar } from '@material-ui/core'
import ArrowUpwardOutlinedIcon from "@material-ui/icons/ArrowUpwardOutlined";
import ArrowDownwardOutlinedICon from "@material-ui/icons/ArrowDownwardOutlined";
import RepeatOutlinedIcon from "@material-ui/icons/RepeatOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import {  MoreHorizOutlined, ShareOutlined } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import '../css/Post.css'
import "../css/Navbar.css";
import Modal from 'react-modal'
import db from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectQuestionId, selectQuestionName, setQuestionInfo } from '../features/questionSlice';
import { selectUser } from '../features/userSlice';
import firebase from 'firebase';
Modal.setAppElement("#root");

function Post({id,question,image,timestamp,collezoneUser})
 {
   const user = useSelector(selectUser)
   const[openModal,setOpenModal] = useState(false)
   const dispatch = useDispatch()
   const questionId = useSelector(selectQuestionId)
   const questionName = useSelector(selectQuestionName)
   const [answer,setAnswer] = useState("")
   const [getAnswer,setGetAnswer] = useState([])

   useEffect(() =>{
     if(questionId){
       db.collection('questions')
       .doc(questionId)
       .collection('answer')
       .orderBy('timestamp' , 'desc') 
       .onSnapshot ((snapshot) => setGetAnswer
       (
        snapshot.docs.map((doc) => ({ id: doc.id, answers: doc.data() }))
       )
        
          )
     }
   },[questionId])

   const handleAnswer = (e) => {
   e.preventDefault()

   if(questionId){
    db.collection('questions').doc(questionId).collection('answer').add({
      answer : answer,
      user: user,
      questionId:questionId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })

    console.log(questionId,questionName)
    setAnswer("")
    setOpenModal(false)
   }

   }
  return (
    <div 
        className = "post"
        onClick = {() => 
      dispatch(setQuestionInfo({
                                 questionId: id,
                                 questionName: question ,
      }))}
      
    >
      <div className = "post_info">
        <Avatar
          src ={collezoneUser.photo}
          
        />
        <h5>{collezoneUser.displayName ? collezoneUser.displayName : collezoneUser.email }</h5>
        <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
      </div>
        
      <div className ="post_body">
        <div className="post_question">
        <p>{question}</p>
        <button
          onClick = {() => setOpenModal(true)}
          className ="post_btnAnswer">
            Answer
          </button>

        <Modal
         isOpen = {openModal}
         onRequestClose = {() => setOpenModal(false)}
         shouldCloseOnOverlayClick={false}
         style ={{
           overlay:
           {
           width:680,
           height:540,
           backgroundColor : "rgba(0,0,0,0.8)",
           zIndex :"1000",
           top: "50%",
           left: "50%",
           marginTop: "-300px",
           marginLeft: "-350px",
           },
         }}
        >
           <div className = "modal__question">
            <h1>{question}</h1>
            <p>asked by{" "} 
            <span className ="name">
              { collezoneUser.displayName? collezoneUser.displayName : collezoneUser.email}
            </span> {" "}
            {""}
             on {" "}
             <span className = "name">
               {new Date(timestamp?.toDate().toLocaleString())}
            </span>
            </p>
            </div>
            <div className = "modal__answer" >
            <textarea
             required 
             value = {answer}
             onChange={(e) => setAnswer(e.target.value)}
             placeholder="Enter your answer"
             type="text"
             />
            </div>
          
            <div className ="modal__button">
            <button className="cancle" onClick={() => setOpenModal(false)}>
              Cancel
            </button>
             <button onClick = {handleAnswer} type ="submit" className="add">
              Add Answer
            </button>
          </div> 
          </Modal> 
          <div className="post__answer">
            {
               
               getAnswer.map (({id,answers})=>(
                <p key = {id} style ={{position: "relative",paddingBottom: "5px"}}>
                   {id === answers.questionId ? (
                <span>
                  {answers.answer}
                  <br />
                  <span
                    style={{
                      position: "absolute",
                      color: "gray",
                      fontSize: "small",
                      display: "flex",
                      right: "0px",
                    }}
                  >
                    <span style={{ color: "#b92b27" }}>
                      {answers.user.displayName
                        ? answers.user.displayName
                        : answers.user.email}{" "}
                      on{" "}
                      {new Date(answers.timestamp?.toDate()).toLocaleString()}
                    </span>
                  </span>
                </span>
              ) : (
                ""
              )}
                </p>
              ))
            }
          </div>
        </div>
        <img src= {image} 
             alt=""/>
      </div>
      <div className ="post_footer">
          <div className="post_footerAction">

            <ArrowUpwardOutlinedIcon />
            <ArrowDownwardOutlinedICon />

          </div>
          
          <RepeatOutlinedIcon/>
          <ChatBubbleOutlineOutlinedIcon/>

          <div className="post_footerLeft">
            <ShareOutlined/>
            <MoreHorizOutlined/>
          </div>

      </div>
    </div>
  )
}

export default Post