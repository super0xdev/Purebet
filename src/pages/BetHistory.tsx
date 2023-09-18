import { useEffect, useState } from 'react'
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { FadeLoader } from 'react-spinners'

import './BetHistory.css'
import DataTable from '../components/DataTable'
import LineChart from '../components/LineChart';

const BetHistory = () => {
    const wallet = useWallet()
    const [data, setData] = useState<any>([])
    const [chartData, setChartData] = useState<any>([])
    const [fromVal, setFromVal] = useState<Dayjs | null>(dayjs('2023-09-01'))
    const [toVal, setToVal] = useState<Dayjs | null>(dayjs('2023-09-14'))
    const [add, setAdd] = useState('')
    const [loader, setLoader] = useState(false)

    const handleHistory = async () => {
        if (!((wallet.publicKey && wallet.connected) || add != '')) {
            alert("Connect your Wallet or Input Address")
            return
        }
        if (!fromVal || !toVal) {
            return
        }
        if (fromVal > toVal) {
            alert("Input Correct Date Range")
            return
        }
        //const addr = wallet.publicKey.toString()
        let addr: any;
        // if (wallet.publicKey && wallet.connected) addr = wallet.publicKey.toString()
        // else {
        //     if (add.length != 44) {
        //         alert("Input Correct Address or Connect your Wallet")
        //         return
        //     }
        //     addr = addr
        // }
        setLoader(true)
        document.body.style.overflow = 'hidden'
        console.log(fromVal.valueOf())
        console.log(toVal.valueOf())
        addr = 'FnBD7DgBpVG1pEkhWhDayacPfN1qQuUrV2RGRocMb8aX'
        const start = fromVal.valueOf() / 1000
        const end = toVal.valueOf() / 1000
        async function fetchData() {
            await axios.get(`https://api.purebet.io/bet/history?addr=${addr}&from=${start}&to=${end}`, { timeout: 300000 })
                .then(res => {
                    setData(res.data.body)
                });
        }
        await fetchData()
        document.body.style.overflow = ''
        setLoader(false)
    }
    useEffect(() => {
        let arr: any = []
        let cnt = 0
        if (!fromVal || !toVal) return
        // const start = new Date(from).getTime() / 1000
        // const end = new Date(to).getTime() / 1000
        const start = fromVal.valueOf() / 1000 - 14400
        const end = toVal.valueOf() / 1000 - 14400
        for (let i = start; i <= end; i += 86400) arr[cnt++] = 0
        for (let i = 0; i < data.length; i++) {
            const tmp = new Date(data[i].startDate * 1000)
            const date = new Date(tmp.getFullYear() + '-' + ("0" + (tmp.getMonth() + 1)).slice(-2) + '-' + ("0" + (tmp.getDate() + 1)).slice(-2))
            const ind = (date.getTime() / 1000 - start) / 86400
            if (typeof (data[i].profitloss) == typeof (0)) arr[ind - 1] += data[i].profitloss
            else {
                const pro = data[i].profitloss.toString()
                arr[ind - 1] += parseFloat(pro.slice(1))
            }
        }
        for (let i = 1; i < cnt; i++) {
            arr[i] = arr[i] + arr[i - 1]
        }
        const tmpChart = []
        for (let i = 0; i < cnt; i++) {
            const tmp = new Date((start + 86400 * (i + 1)) * 1000)
            const date = tmp.getFullYear() + '-' + ("0" + (tmp.getMonth() + 1)).slice(-2) + '-' + ("0" + tmp.getDate()).slice(-2)
            tmpChart.push({ "date": date, "value": arr[i] })
        }
        setChartData(tmpChart)
    }, [data, setChartData])
    return (
        <>
            <div className='main'>
                <div className='header'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{
                                '*': { color: 'white !important' },
                                '.MuiOutlinedInput-root': { border: 'solid 1px gray' },
                                '.Mui-focused': { border: 'none', color: '#24acff !important' },
                                '.MuiInputLabel-root': { bgcolor: 'black', color: 'white' },
                            }}
                            label={'From'}
                            views={['year', 'month', 'day']}
                            value={fromVal}
                            onChange={(newVal) => setFromVal(newVal)}
                        />
                        <DatePicker
                            sx={{
                                '*': { color: 'white' },
                                '.MuiOutlinedInput-root': { border: 'solid 1px gray' },
                                '.Mui-focused': { border: 'none', color: '#24acff !important' },
                                '.MuiInputLabel-root': { bgcolor: 'black', color: 'white' },
                            }}
                            label={'To'}
                            views={['year', 'month', 'day']}
                            value={toVal}
                            onChange={(newVal) => setToVal(newVal)}
                        />
                    </LocalizationProvider>
                    <div className='btn-history' onClick={handleHistory}>SHOW HISTORY</div>
                    <TextField sx={{
                        '*': { 'color': 'white !important' },
                        '.MuiOutlinedInput-root': { border: 'solid 1px gray' },
                        '.Mui-focused': { border: 'none', color: '#24acff !important' },
                        '.MuiInputLabel-root': { bgcolor: 'black', color: 'white' },
                    }} label="Input Address" variant='outlined' value={add} onChange={(val: any) => setAdd(val.target.value)} />
                </div>
                <DataTable data={data} />
                <LineChart data={chartData} />
            </div >
            {loader &&
                <div className='loader'>
                    <div className='loader-main'>
                        <FadeLoader color='#ff00ff' loading={loader} size='20' />
                    </div>
                </div>
            }
        </>
    )
}

export default BetHistory
