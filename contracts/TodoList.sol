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

    //Called when the smart contract runs for the first time
    constructor() public{
        createTask("Welcome to my first blockchain project");
    }

    //Mapping the struct Task
    function createTask(string memory _content) public{
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
}