
App = {
    
    contracts:{},
    loading: false,
    //Load app...
    load: async () => {
        // Web3.eth.defaultAccount = Web3.eth.accounts[0]
        await App.loadWeb3();
        await App.loadAccount();    
        await App.loadContracts();
        await App.render();
    },

    //Web3JS -> connects to blockchain
    //The client-side needs to connect to the blockchain server
    //and thats where the Web3 JS comes in
    loadWeb3: async () => {
    // Modern dapp browsers...
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
},

    //Load account info
      loadAccount: async () => {
        App.account = (await web3.eth.getAccounts())[0];
        console.log(App.account);          
        // web3.eth.getAccounts().then(console.log);
      },

      //load contract information from metamask
      loadContracts: async () => {
        const todolist = await $.getJSON('TodoList.json');

        //Create truffle contract
        App.contracts.TodoList = TruffleContract(todolist);
        App.contracts.TodoList.setProvider(App.web3Provider);

        //Get copy of smart contract ->Getting values from blockchain
        App.todolist = await App.contracts.TodoList.deployed();
        // console.log(todolist);
        // App.contracts.TodoList = TruffleContract(todolist);
        // console.log(todolist);
      },

      //render the values on the html page
      render: async () => {
        //prevent double rendering
        if(App.loading){
            return
        }

        //Update app loading state
        App.setLoading(true);

          //render account
          $('#account').html(App.account);
          //render tasks
        await App.renderTasks();
        //Update app loading state to false after loading of data  
        App.setLoading(false);
      },

      //render tasks on the html page
      renderTasks : async () => {
        //load total tasks from the blockchain
        const taskCount = await App.todolist.taskCount();
        const $tasktemplate = $('.taskTemplate');

        //render out each task with task template
        for (let i = 1; i <= taskCount; i++) {
            //Fetch the values from the blockchain
            const task = await App.todolist.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1]
            const taskCompleted = task[2];
            
        //create html foe all the tasks
        const $newtaskTemplate = $tasktemplate.clone()
        $newtaskTemplate.find('.content').html(taskContent)
        $newtaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted) 
                        .on('click', App.toggleCompletion)
        //place tasks in the correct list
        if(taskCompleted) {
            $('#completedTaskList').append($newtaskTemplate)
        }else {
            $('#taskList').append($newtaskTemplate)
        }

            //show tasks
            $newtaskTemplate.show()
        }
      },

      //creating a task 
      createTask: async() => {
        App.setLoading(true);
        const newTask = $("#newTask").val();
        await App.todolist.createTask(newTask, {from: App.account});    //creates the task and fetching from --> blockchain account
        window.location.reload();
      },

      //toggling task completion
      toggleCompletion: async(e) => {
        App.setLoading(true);
        const taskId = e.target.name;
        await App.todolist.toggleCompleted(taskId, {from:App.account});
        window.location.reload();
      },

      setLoading: (boolean) => {
          App.loading = boolean;
          const loader = $("#loader")
          const content = $("#content")
          if(boolean){
              loader.show();
              content.hide(); //hide content
            }else {
                loader.hide();   //hide loader
                content.show();  //show content
          }
      }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})