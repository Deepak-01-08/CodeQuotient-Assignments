const newTask=document.getElementsByClassName('todoTask')[0];
const newt=document.getElementById('taskTodo')

//Fill the name filed
let userName=prompt('Enter your name...')
 document.getElementById('name').innerText=userName;

getToDos();

newTask.addEventListener('keypress',function(e){
    let newTaskValue=newTask.value;
    if(e.key==='Enter'){

       saveToDo(newTaskValue,function(error){
        if (error) {
            alert(error);
        }
        else{
            addToDom(newTaskValue);
        }
       });
    }
})



function saveToDo(value,callback){
    fetch('/todohome',{
        method:'Post',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({text:value,checked:false})
    })
    .then(function(res){
        if(res.status===200){
            callback();
        }
        else{
            callback('error')
        }
    })
}


function addToDom(value){

   

    const parentItem=document.getElementsByClassName('list-items')[0];
    const createLi=document.createElement('li');
    const createLabel=document.createElement('label');
    createLabel.innerText=value;
    createLabel.className='task';

    const createCheckbox=document.createElement('input');
    createCheckbox.type='checkbox';
    createCheckbox.className='floatRight';

    const createDeleteSign=document.createElement('span');
    createDeleteSign.innerText='X';
    createDeleteSign.className='floatRight'

    parentItem.appendChild(createLi);
    createLi.appendChild(createLabel);
    createLi.appendChild(createDeleteSign)
    createLi.appendChild(createCheckbox);


    createDeleteSign.addEventListener('click',()=>{
        deleteToDo(value,function(error){
            if (error) {
                alert(error);
            }
            else{
                parentItem.removeChild(createLi);
            }
        });
    
    })



    createCheckbox.addEventListener('change',(e)=>{
        if (e.currentTarget.checked) {   
            
            checkedHandler(value,function(error){
                if (error) {
                    alert(error);
                }
                else{
                    createLabel.classList.add('cut');
                }
            });

        }
        else{
            checkedHandler(value,function(error){
                if (error) {
                    alert(error);
                }
                else{
                    createLabel.classList.remove('cut');
                }
            });
           

        }
    })
    
}


function deleteToDo(val,callback){
    fetch('/todohome',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text:val})
    })
    .then(function(res){
        if(res.status===200){
            callback();
        }
        else{
            callback('not deleted');
        }
    })
}



function getToDos(){
    fetch('/gettodo')
    .then(function(res){
        if(res.status!==200){
             throw new Error('something wrong')
        }
       return res.json();
    })
    .then(function(todos){
         todos.forEach(todo => {
            addToDom(todo.text);
         });
    })
    .catch(function(error){
        alert(error)
    })

}



function checkedHandler(value,callback){
   
    fetch('/todohome',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text:value})
    })
    .then((res)=>{
        if (res.status===200) {
            callback();
        }
        else{
            callback("error in checked change time ")
        }
    })

}


