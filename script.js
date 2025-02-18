const itemForm=document.getElementById('item-form');
const itemInput=document.getElementById('item-input');
const itemList=document.getElementById('item-list');
const clearBtn=document.getElementById('clear');
const itemFilter=document.getElementById('filter');
const formBtn=itemForm.querySelector('button');
let isEditMode=false;

function displayItem(){
  const itemFromStorage=getItemFromStorage();
   itemFromStorage.forEach(item => addItemToDOM(item));
   checkUI();
}

function addItemSubmit(e){
    e.preventDefault();
    const newItem=itemInput.value;
    if(newItem===''){
        alert('Please add an item');
        return;
    }

    if(isEditMode){
      const itemToEdit=itemList.querySelector('.edit-mode');
      removeItemFromStorage(itemToEdit.textContent);
      if(checkItem(newItem)){
        alert('Item already exists!');
        return ;
      }
      itemToEdit.classList.remove('edit-mode');
      itemToEdit.remove();
      isEditMode=false;
    }else{
      if(checkItem(newItem) ){
        alert('Item already exists!');
        return ;
      }
      
    }
    

    addItemToDOM(newItem);
    addItemToStorage(newItem);
    checkUI();
    itemInput.value='';
 
}

function addItemToDOM(item){
  const li=document.createElement('li');
  li.appendChild(document.createTextNode(item));
  
  const button=createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}


function addItemToStorage(item){
  const ItemlocalStorage=getItemFromStorage();
  
  ItemlocalStorage.push(item);

  localStorage.setItem('items',JSON.stringify(ItemlocalStorage));

}

function getItemFromStorage(){
  let ItemlocalStorage;
  if(localStorage.getItem('items')==null){
    ItemlocalStorage=[];
  }else{
    ItemlocalStorage=JSON.parse(localStorage.getItem('items'));
  }
  return ItemlocalStorage;
}

function createButton(classes){
    const button=document.createElement('button');
    button.className=classes;
    const icon=createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon=document.createElement('i');
    icon.className=classes;
    return icon;
}
function onClickItem(e){
  if(e.target.parentElement.classList.contains('remove-item')){
    removeItem(e.target.parentElement.parentElement);
  }
  else{
   setItemToEdit(e.target);
  }
}

function setItemToEdit(item){
  isEditMode=true;

  itemList
  .querySelectorAll('li')
  .forEach(i=> i.classList.remove('edit-mode'));


  item.classList.add('edit-mode');
  formBtn.innerHTML='<i class="fa-solid fa-pen"></i>Update Item';
  formBtn.style.backgroundColor='green';
  itemInput.value=item.textContent;
 
  

}

function checkItem(item){
  const itemFromStorage=getItemFromStorage();
  return itemFromStorage.includes(item);
}



function removeItem(item){
  if(confirm('Are you sure?')){
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();

  }
}

function removeItemFromStorage(item){
   let itemFromStorage=getItemFromStorage();
   itemFromStorage=itemFromStorage.filter((i)=> i !== item);
   localStorage.setItem('items',JSON.stringify(itemFromStorage))
}

function clearItem(){
  itemList.innerHTML='';

  localStorage.removeItem('items');
  checkUI();

}

function checkUI(){
    
    const items=itemList.querySelectorAll('li');
  if(items.length===0){
      clearBtn.style.display='none';
      itemFilter.style.display='none';
  }else{
    clearBtn.style.display='block';
      itemFilter.style.display='block';
  }
  formBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor='#333';
   isEditMode=false;
}

function filterItem(e){
  const items=itemList.querySelectorAll('li');
   const text=e.target.value.toLowerCase();

   items.forEach((item)=>{
    const itemName=item.firstChild.textContent.toLowerCase();
    
    if(itemName.indexOf(text) != -1){
      item.style.display ='flex';
      
    }else{
      item.style.display='none';
    }


   })

}



itemForm.addEventListener('submit',addItemSubmit);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItem);
itemFilter.addEventListener('input',filterItem);
document.addEventListener('DOMContentLoaded',displayItem);
