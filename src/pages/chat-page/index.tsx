import { useEffect, useState } from "react"
import { generateAnswer } from "./prompt"
import { List, Input, Avatar } from 'antd';

const { Search } = Input

const CustomAvaTar = () => (
  <Avatar
    shape="square"
    size={60}
    style={{
      backgroundColor: '#f56a00',
      verticalAlign: 'middle',
      fontSize: '300px',
      marginRight: '12px'
    }}
    gap={4}
  >
    YYDS-AI
  </Avatar>
)

const ChatPage = () => {
  // const data = [
  //   'Racing car sprays burning fuel into crowd.',
  //   'Japanese princess to wed commoner.',
  //   'Australian walks 100km after outback crash.',
  //   'Man charged over missing wedding girl.',
  //   'Los Angeles battles huge wildfires.',
  // ];

  const [chats, setChats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("")

  const isQuestion = (index: number) => index % 2 === 0

  const handleSubmit = (val: string) => {
    setInputValue(val)
    getAnswer(val)
  }

  const getAnswer = async (question: string) => {
    if (!question) return
    setLoading(true)
    setInputValue("")
    setChats(prev => [...prev, question])
    const res = await generateAnswer(question)

    let str = ''

    setChats(prev => [...prev, str])
    for await (const chunkStr of res) {
      str += chunkStr
      setChats(prev => {
        const cloneChats = [...prev]
        cloneChats.pop()
        cloneChats.push(str)
        return cloneChats
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    const initialQues = '你是谁？'
    handleSubmit(initialQues)
  }, [])

  return (
    <>
      <List
        header={<div className="text-center font-mono text-2xl font-bold line-clamp-3 text-blue-600/100">YYDS战队PUBG知识助手</div>}
        bordered
        dataSource={chats}
        renderItem={(item, index) => (
          <List.Item className={isQuestion(index) ? 'bg-red-100 rounded-full' : 'bg-slate-100'}>
            {/* <Typography.Text mark>{isQuestion(index) ? '提问' : '回答'}</Typography.Text> */}
            <span>
              <span>
                {isQuestion(index) ? '' : <CustomAvaTar />}
              </span>
              {item}
            </span>
          </List.Item>
        )}
      />
      <Search
        placeholder="输入 PUBG 问题"
        enterButton="提问"
        size="large"
        value={inputValue}
        loading={loading}
        onSearch={handleSubmit}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <p className="bg-slate-100 mt-3 ml-2">例子：手雷有多重？烟雾弹持续时间有多长？</p>
    </>
  )
}

export default ChatPage