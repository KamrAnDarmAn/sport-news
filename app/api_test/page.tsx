import { getNumberOfStoriesForEachCategory } from '@/lib/actions/search.actions';
import React from 'react'

// const API_BASE_URL = `https://newsdata.io/api/1/latest? 
//   apikey=pub_afed1d34be0d410f83d99eceae6a27c1`
const Page = async () => {
    // const res = await fetch(API_BASE_URL)
    // const result = await res.json();
    // console.log('RESULT: ', result)

    const stories = await getNumberOfStoriesForEachCategory();
    console.log('NO. OF STORIES: ', stories.stoies)
    return (
        <div>Page</div>
    )
}

export default Page