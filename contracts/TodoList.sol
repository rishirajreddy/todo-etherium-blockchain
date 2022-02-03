//solidity version
pragma solidity ^0.5.16;

contract TodoList {
    //--taskCount = Static  Variable taskCount
    //--public =  Read the value taskCount function from TodoList
    uint public taskCount = 0;
    
    //Task model/structure
    struct Task{
        uint id;
        string content;
        bool completed;
    }

    //mapping the tasks with the taskCount(which stores the data in the blockchain)
    //using the tasks function to display the tasks on the todoList
    mapping(uint => Task) public tasks;

    //creating tasks
    //creating events for the tasks
    //gets triggered whenever the task is created
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    //Called when the smart contract runs for the first time
    constructor() public{
        createTask("Welcome to my first blockchain project");
    }

    //Mapping the struct Task
    function createTask(string memory _content) public{
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }
}