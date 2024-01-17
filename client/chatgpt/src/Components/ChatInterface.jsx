import React,{useState,useEffect} from 'react'

const ChatInterface = () => {
    const [message,setMessage] = useState('');
    const [value,setValue] = useState('');
    const[previousChats,setPreviousChats] = useState([]);
    const [currentTitle,setCurrentTitle] = useState(null);
    const getMessages = async () => {
      try {
        const response = await fetch('http://localhost:8000/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: value,
          }),
        });
        const data = await response.json();
        setMessage(data.choices[0].message.content);
      } catch (error) {
        console.error(error);
      }
    };
    
    useEffect(() => {
      if(!currentTitle && value && message){
        setCurrentTitle(value)
      }
      if(currentTitle && value && message){
        setPreviousChats(prevChats=>(
          [...prevChats,{
            title :currentTitle,
            role : "user",
            content : value
          },
          {
            title : currentTitle,
            role :"assistant",
            content : message
          }]
        ))
      }
    }, [message,currentTitle]);
    
    
    const createNewChat = ()=>{
      setMessage(null);
      setValue("");
      setCurrentTitle(null);
    }
    const clearChat = ()=>{
        setPreviousChats([]);
      }
    const handleClickonChat = (uniqueTitle)=>{
      setCurrentTitle(uniqueTitle)
      setMessage(null);
      setValue("");
    }
  
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);

    const currentChat = previousChats.filter(previousChat => previousChat.title==currentTitle);
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat=>previousChat.title)));
    return (
      <div className='bg-[#202123] flex h-screen w-full text-white'>
        <section className=' bg-[#343541] h-screen w-[80px] flex flex-col items-center  text-[#7c7b7b]'>
        <img className='w-[50%] m-3' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGcqPWycRJQlfhHt8oLpw2QW5kkM-fWin9SA&usqp=CAU'/>
        <div className='flex flex-col gap-[25px] h-[80%] justify-center'>
        <i className='bx bx-grid-alt text-[25px]'></i>
        <i className='bx bx-trending-up text-[25px]'></i>
        <i className='bx bx-message text-[25px] text-green-600'></i>
        <i className='bx bxs-image text-[25px]'></i>
        <i className='bx bxs-music text-[25px]'></i>
        <i className='bx bxs-bookmark text-[25px]'></i>
        <i className='bx bx-exit text-[25px]'></i>
        </div>
        </section>
        <div className='w-[100%] h-screen'>
            <div className='flex py-2 justify-center w-[100%] bg-[#343541] items-center'>
                <div className='w-[80%] flex justify-center'>
                <span className='border-white border-[1px] py-1 px-2 rounded-full'>
                    <input type='text' className='bg-transparent outline-none focus:outline-none px-2 text-sm'/>
                <i className='bx bx-search'></i>
                </span>
                </div>
                <div className='flex gap-[20px]'>
                <i className='bx bx-bell text-[25px]'></i>
                <span><i className='bx bxs-user-circle text-[25px]'></i><i class='bx bx-chevron-down'></i></span>
                </div>
            </div>
            <div className='flex'>
            <section className=' h-[85vh] w-[300px] flex flex-col justify-between'>
          <h1 className='text-2xl font-semibold mt-5 text-center'>Text Generator</h1>
          <ul className='p-3 mb-3 h-[100%]'>
  {uniqueTitles?.map((uniqueTitle, index) => (
    <li
      key={index}
      className='list-none py-2 text-sm text-gray-100 my-3 w-[100%] bg-[#343541]  px-3 rounded-full cursor-pointer'
      onClick={() => handleClickonChat(uniqueTitle)}
      style={{ border: `2px solid ${currentTitle === uniqueTitle ? 'green' : '#343541'}` }}
    >
      <span className='flex items-center gap-2'>
        <i className='bx bx-message'></i>
        {uniqueTitle}
      </span>
    </li>
  ))}
</ul>

          <div className='w-[100%]'>
          <button 
          onClick={createNewChat}
          className='w-[100%] border-[0.5px] border-green-600 text-green-600 rounded-full bg-transparent p-1 m-2'>
            <i class='bx bx-plus-circle'></i> New Chat</button>
            <button 
          onClick={clearChat}
          className='w-[100%] border-[0.5px] border-red-600 text-red-600 rounded-full bg-transparent p-1 m-2'>
            <i class='bx bxs-tag-x'></i> Clear Conversation</button>
          </div>
        </section>
        <section className='h-[90vh] mx-5 w-[100%] flex flex-col justify-between items-center'>
          
        <ul className="overflow-auto">
  {currentChat?.map((chat, index) => (
    <li
      key={index}
      className={`flex max-w-[80%] ${
        chat.role === 'user' ? 'px-4' : 'px-4 ml-auto'
      }`}
    >
      <div>
        <span className='my-2 mx-3 text-[10px] text-gray-400'>{new Date().getHours().toString()}:{new Date().getMinutes().toString()} {formattedDate}</span>
      <p
        className={`text-[rgba(255,255,255,0.8)] text-[14px]  p-2 my-2 mx-3 rounded-lg   ${
          chat.role === 'user' ? '' : 'relative float-end'
        }`}
        style={{ width: chat.role === 'user' ? 'max-content' : 'auto',backgroundColor:'#444654',minWidth:'30%' }}
      >
        {chat.content}
      </p>
      </div>
    </li>
  ))}
</ul>
          <div className="w-[100%] flex flex-col justify-center items-center mt-5">
            <div className='w-[80%]'>
              <span className='p-2 focus-within:border-white border-[0.5px] border-[#202123] shadow-[rgba(0,0,0,0.05) 0 54px 55px;rgba(0,0,0,0.05)0 54px 55px] bg-[rgba(255,255,255,0.05)] focus:outline-none px-3 rounded-md'><input 
              type='text'
              onChange={(e)=>setValue(e.target.value)}
              className='w-[90%] bg-transparent focus:outline-none'/>
              <i class='bx bxs-send' onClick={getMessages}></i>
              </span>
            </div>
            
          </div>
        </section>
            </div>
        </div>
      </div>
    )
  }
export default ChatInterface
