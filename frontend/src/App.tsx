import { useState } from 'react'
import './App.css'
import { uploadFile } from './services/upload'
import { Toaster , toast} from 'sonner'
import { type Data } from './types'

const APP_STATUS = {
  IDLE: 'idle',
  REDY_TO_UPLOAD: 'ready_to_upload',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

const BUTTON_TEXT = {
  [APP_STATUS.REDY_TO_UPLOAD]:'Upload File',
  [APP_STATUS.UPLOADING]:'Uploading...',
} as const

type AppStatus = typeof APP_STATUS[keyof typeof APP_STATUS]

function App() {

  const [appStatus, setAppStatus] = useState<AppStatus>(APP_STATUS.IDLE)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? []
    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.REDY_TO_UPLOAD)
    }
  
  }
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(appStatus !== APP_STATUS.REDY_TO_UPLOAD || !file) {
      return
    }
    setAppStatus(APP_STATUS.UPLOADING)
    console.log('file', file)
    const [err, newData] = await uploadFile(file)
    if(err) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }
    setAppStatus(APP_STATUS.SUCCESS)
    if(newData) {
      console.log('newData', newData)
      setData(newData)
    }
    toast.success('File uploaded successfully')
  }

  const showButton = appStatus === APP_STATUS.REDY_TO_UPLOAD || appStatus === APP_STATUS.UPLOADING

  return (
    <div>
      <Toaster />
      <h4>Challenge: Upload CSV File & Search</h4>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
         <input
          disabled={appStatus === APP_STATUS.UPLOADING} 
          onChange={handleInputChange} 
          name='file' 
          type="file" 
          accept=".csv" />
        </label>
        {
          showButton && 
          (
            <button type="submit" disabled={appStatus === APP_STATUS.UPLOADING }>{ BUTTON_TEXT[appStatus] }</button>
          )
        }
        
        </form>
      </div>
    </div>
  )
}

export default App
