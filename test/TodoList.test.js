const { assert } = require("chai");

const TodoList = artifacts.require("./TodoList.sol");

contract('TodoList',(accounts) => {
    
    //before any testr run
    //deploy a copy to the variable todolist
    before(async() =>{
        this.todolist = await TodoList.deployed(); 
    })

    //test for checking the address of the account
    it('deploys successfully', async() => {
        const address = await this.todolist.address;
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    //test for the listing out the tasks
    it("lists tasks sucessfull", async() => {
        const taskCount = await this.todolist.taskCount();  //take taskcount
        const task = await this.todolist.tasks(taskCount);   //take if the task exists or not
        assert.equal(taskCount.toNumber(), task.id.toNumber());
        assert.equal(task.content, "Welcome to my first blockchain project");
        assert.equal(task.completed, false);
        assert.equal(taskCount.toNumber(),1);
    })
})