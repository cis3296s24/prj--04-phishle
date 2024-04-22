$(function(){
    var user = sessionStorage.getItem("username");
    var usergroup = 0
    if(user){
        var profileUrl = "http://localhost:5000/getProfileInfo/" + user
        var prof = $.ajax({url:profileUrl, method:"GET", success: function(data){
            $("#username").html(data.username);
            $("#streak").html(data.currentstreak + " days")
            $("#currentStreak").html(data.currentstreak + " days")
            $("#highStreak").html(data.longeststreak + " days")
            $("#cardusername").html(data.username);
            usergroup = data.group_id
            if(usergroup != 0){
                
                fetch('http://localhost:5000/getGroup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({Username: data.username}),
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        $("#cardGroupName").html(data.group_name);
                        $("#groupLeaderCard").html(data.group_leader);
                    } else {
                        alert("Group Check Info Failed");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

                fetch('http://localhost:5000/getGroupCode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({group_id: data.group_id}),
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        $("#groupCodeCard").html(data.group_code);
                    } else {
                        alert("Group Check Info Failed");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });


                var grpurl = "http://localhost:5000/getGroupLeaderboard/" + usergroup
                var grpReq = $.ajax({url:grpurl, method:"GET", success: function(data){
                    var tableString = "";
                    $.each(data, function(index, value){
                        var pos = index+1
                        if(value[0] === user){
                            $("#groupRanking").html(pos);
                        }
                        tableString += "<tr><th>"+pos+"</th><td>"+value[0]+"</td><td>"+value[1]+"</td><td>"+value[2]+"</td></tr>"
                    });
                
                
                    $("#groupLeaderboardBody").append(tableString)
                }});
                grpReq.done(function(msg){
                    $("#groupLeaderboard").DataTable({
                        responsive:true
                    });
                })
            }else{
                console.log(usergroup)
                $("#groupLeaderboardBody").append("You are not in a group! Add yourself to a group to see the group leaderboard.")
            }
        }});
    }
    else{
        $("#notsignedin").show();
        $("#signUp").show();
        $("#profileDetails").attr('disabled', true);
        $("#userCard").hide();
        $("#group-create-form-container").hide();
        $("#group-join-form-container").hide();
        $("#groupCard").hide();
    }

    var req  = $.ajax({url:"http://localhost:5000/getGlobalLeaderboard", method:"GET", success: function(data){
        var tableString = "";
        $.each(data, function(index, value){
            var pos = index+1
            if(value[0] === user){
                $("#globalRanking").html(pos);
            }
            tableString += "<tr><th>"+pos+"</th><td>"+value[0]+"</td><td>"+value[1]+"</td><td>"+value[2]+"</td></tr>"
        });
        $("#globalLeaderboardBody").append(tableString)
        
    }});
    req.done(function(msg){
        $("#globalLeaderboard").DataTable({
            responsive:true
        });
    })


    

    
    

    $("#profileDetails").click(function(){
        
    });
    $("#signUp").click(function(){
        window.location.href = "login.html";
    });

    
    
});

document.getElementById("createGroupbtn").addEventListener("click", function() {
    const groupName = document.getElementById("groupName").value;

    fetch('http://localhost:5000/createGroup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({Username: sessionStorage.getItem("username"), GroupName: groupName}),
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert("Group creation successful!");
        } else {
            alert("Group creation Failed!");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});


document.getElementById("joinGroupbtn").addEventListener("click", function() {
    const groupCode = document.getElementById("groupCode").value;

    fetch('http://localhost:5000/joinGroup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({Username: sessionStorage.getItem("username"), GroupCode: groupCode}),
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert("Group joining successful!");
        } else {
            alert("Group joining Failed!");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById("leaveGroupbtn").addEventListener("click", function() {

    fetch('http://localhost:5000/leaveGroup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({Username: sessionStorage.getItem("username")}),
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert("Group leaving successful!");
        } else {
            alert("Group leaving Failed!");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});