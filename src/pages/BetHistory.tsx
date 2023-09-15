import { useEffect, useState } from 'react'
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import dayjs, { Dayjs } from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import './BetHistory.css'
import DataTable from '../components/DataTable'
import LineChart from '../components/LineChart';

const BetHistory = () => {
    const wallet = useWallet()
    const [from, setFrom] = useState('2023-09-01')
    const [to, setTo] = useState('2023-09-14')
    const [data, setData] = useState<any>([])
    const [chartData, setChartData] = useState<any>([])
    const [fromVal, setFromVal] = useState<Dayjs | null>(dayjs('2023-09-01'))
    const [toVal, setToVal] = useState<Dayjs | null>(dayjs('2023-09-14'))

    const handleFrom = (val: any) => {
        setFrom(val.target.value)
    }
    const handleTo = (val: any) => {
        setTo(val.target.value)
    }
    const handleHistory = async () => {
        if (!(wallet.publicKey && wallet.connected)) {
            alert("Connect your Wallet")
            return
        }
        if (!fromVal || !toVal) return;
        //const addr = wallet.publicKey.toString()
        const addr = 'FnBD7DgBpVG1pEkhWhDayacPfN1qQuUrV2RGRocMb8aX'
        const start = fromVal.valueOf() / 1000
        const end = toVal.valueOf() / 1000
        async function fetchData() {
            const dat = await axios.get(`https://api.purebet.io/bet/history?addr=${addr}&from=${start}&to=${end}`);
            setData(dat.data.body)

        }
        await fetchData()
    }
    console.log(data)
    console.log(fromVal?.valueOf())
    useEffect(() => {
        let arr: any = []
        let cnt = 0
        const start = new Date(from).getTime() / 1000
        const end = new Date(to).getTime() / 1000
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
                <input type='date' value={from} onChange={(v) => handleFrom(v)} style={{ fontSize: '18px' }} />
                <input type='date' value={to} onChange={(v) => handleTo(v)} style={{ fontSize: '18px' }} />
                <div className='btn-history' onClick={handleHistory}>SHOW HISTORY</div>
            </div>

            <DataTable data={data} />
            <LineChart data={chartData} />
        </div>
    )
}

export default BetHistory
