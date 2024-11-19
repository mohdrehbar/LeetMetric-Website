document.addEventListener("DOMContentLoaded",function(){
    // to select all the fieds jisme hme changes krne hai

    const searchbutton=document.getElementById("searchbutton");
    const usernameinput=document.getElementById("name");
    const statscontainer=document.querySelector(".progress");
    const easyprogresscircle=document.querySelector(".easy");
    const mediumprogresscircle=document.querySelector(".medium");
    const hardprogresscircle=document.querySelector(".hard");
    const easylabel=document.getElementById("easylabel");
    const mediumlabel=document.getElementById("mediumlabel");
    const hardlabel=document.getElementById("hardlabel");
    const cardcontainer=document.querySelector(".cards");

    // return true or false based on regex
    function checkusername(username){
        if(username.trim()===""){
            alert("Invalid UserName");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;
        const ismatching=regex.test(username);
        if(!ismatching){
            alert("Invalid UserName");
        }
        return ismatching;

    }

    async function fetchuserdetails(username){
        try{

            searchbutton.textContent="Searching..."
            searchbutton.disabled=true;

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");
            

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch User Details")
            }
            const parseddata=await response.json();
            console.log("logging data : ",parseddata);

            displayuserdata(parseddata);
            
        }
        catch(error){
            statscontainer.innerHTML=`<p>Data Not Found</p>`

        }
        finally{
            searchbutton.textContent="Search"
            searchbutton.disabled=false;
        }

    }

    function updateprogress(solved,total,label,circle){
        const progressdegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressdegree}%`)
        label.textContent=`${solved}/${total}`;

    }

    function displayuserdata(parseddata){
        const totalques=parseddata.data.allQuestionsCount[0].count;
        const totaleasyques=parseddata.data.allQuestionsCount[1].count;
        const totalmediumques=parseddata.data.allQuestionsCount[2].count;
        const totalhardques=parseddata.data.allQuestionsCount[3].count;

        const totalquessolved=parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const totaleasyquessolved=parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const totalmediumquessolved=parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const totalhardquessolved=parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateprogress(totaleasyquessolved,totaleasyques,easylabel,easyprogresscircle);
        updateprogress(totalmediumquessolved,totalmediumques,mediumlabel,mediumprogresscircle);
        updateprogress(totalhardquessolved,totalhardques,hardlabel,hardprogresscircle);

        const carddata=[
            {label: "Total Submissions",value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label: "Total Easy Submissions",value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label: "Total Medium Submissions",value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label: "Total Hard Submissions",value: parseddata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}  
        ];
        console.log(carddata);

        // to dynamically display cards
        cardcontainer.innerHTML=carddata.map(
            data =>{
                return `
                    <div class="card">
                    <h2>${data.label}</h2>
                    <p>${data.value}</p>
                    </div>`
            }
        ).join("")

    }

    searchbutton.addEventListener('click',function(){
        const username=usernameinput.value;
        console.log("userename : ",username);
        if(checkusername(username)){
            fetchuserdetails(username);
            
        }
        
    })
})
