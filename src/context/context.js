import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

//fetch req to get rate limit
//want it to run after each and every re-render


const GithubContext = React.createContext();


//setup functionality here so that children can have access to all
//global state available to the whole application
const GithubProvider = ({children}) => {
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);

    const searchGithubUser = async(user) => {
        toggleError()
        setIsLoading(true)
        console.log(user);
        const response = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err));
        console.log(response);                 
        if(response){
            setGithubUser(response.data);
            const {login, followers_url} = response.data;
            //(https://api.github.com/users/john-smilga/repos?per_page=100)
            //(https://api.github.com/users/john-smilga/followers)
            await Promise.allSettled([axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                                      axios(`${followers_url}?per_page=100`)]).then((results) => {
                                        const[repos,followers] = results;
                                        const status = "fulfilled"; 
                                        if(repos.status === status){
                                            setRepos(repos.value.data);
                                         }
                                        if(followers.status === status){
                                            setFollowers(followers.value.data);
                                         }
                                      })
        }else{
            toggleError(true, "No user with that username.");
        }        
        checkRequests();
        setIsLoading(false);         
    }

    //need to check rate limit url call
    //by default number of requests is 0
    const [requests, setRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const checkRequests = () => {
        //axios returns promise
        axios(`${rootUrl}/rate_limit`).then(({data}) => {
            console.log(data);
            let {rate:{remaining}} = data;
            setRequests(remaining);
            if(remaining === 0){
                toggleError(true, "Sorry, you have exceeded hourly rate limit");
            }
        }).catch((err) => console.log(err));
    }

    function toggleError(show = false, msg = ''){
        setError({show, msg});
    }

    useEffect(checkRequests, []);

    return (<GithubContext.Provider value={{githubUser, repos, followers, requests, error, searchGithubUser, isLoading}}>
            {children}
         </GithubContext.Provider>
    );};
//now have access to both Provider and Consumer
// - GithubContext.Provider/.Consumer

export {GithubProvider, GithubContext};