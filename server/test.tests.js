import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
// import { Mongo } from 'meteor/Mongo';

movies=new Mongo.Collection('movies');

describe('Server Side Tests', function () {
	
	beforeEach(function () {
        //resetDatabase();
        if(movies.find().count() <= 0)
        {
            Assets.getText('output.txt', function(err, data) {
                if (err) {
                    console.log('Error: ' + err);
                    return;
                }
               
                data = JSON.parse(data);
                for(var i= 0; i< data.length; i++){
                    // console.log(data[i]);
                    movies.insert(data[i]);
                }
            });
        }
  	});

	it('Can find existing movie in the DB by name', () => {
        
        //movies.insert({name:"Avatar"});
        // const result = movies.find({name: "Avatar"}).count();
        console.log(movies.find().count());
        var searchTerm='Avatar';
        var result = movies.findOne({name: 'Harry Potter and the Half-Blood Prince'});
        console.log(result);
        // Verify that the method does what we expected
        assert.equal('2009', result.year);
      });
	
	it('Returns only existing movies (query with not existed movie name returns nothing)', () => {
        // Find the internal implementamtion of the task method so we can
        // test it in isolation
       // movies.insert({name:"Avatar"});
        var result = movies.find({year: "2040"}).count();
        // Verify that the method does what we expected
        assert.equal(result, 0);
      });


    it('Can find existing movie in the DB by year', () => {
        //movies.insert({name:"Avatar"});
        // const result = movies.find({name: "Avatar"}).count();
        console.log(movies.find().count());
        var searchTerm='Avatar';
        var result = movies.findOne({year: '2009'});
        // Verify that the method does what we expected
        assert.equal('2009', result.year);
      });
    

    it('Can find only existing movie in the DB by Director', () => {        
        //movies.insert({name:"Avatar"});
        // const result = movies.find({name: "Avatar"}).count();
        console.log(movies.find().count());
        var searchTerm='Avatar';
        var result = movies.findOne({director: 'David Yates'});
        // console.log(result);
        // Verify that the method does what we expected
        assert.equal('2009', result.year);
      });
    
    it('Search for a movie by non existing director', () => {        
        //movies.insert({name:"Avatar"});
        // const result = movies.find({name: "Avatar"}).count();
        console.log(movies.find().count());
        var searchTerm='Avatar';
        var result = movies.findOne({director: 'Aliii Aliiii Alliii'});
        // console.log(result);
        // Verify that the method does what we expected
        assert.equal(result, undefined);
      });
    
 });