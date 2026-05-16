import React from 'react'

const API_BASE_URL = `https://newsdata.io/api/1/latest? 
  apikey=pub_afed1d34be0d410f83d99eceae6a27c1`
const Page = async () => {
    const res = await fetch(API_BASE_URL)
    const result = await res.json();
    console.log('RESULT: ', result)
    return (
        <div>Page</div>
    )
}

export default Page