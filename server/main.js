import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
    console.log('starting up');
    if (movies.find().count() <= 0) {
        Assets.getText('output.txt', function(err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                //console.log(data[i]);
                movies.insert(data[i]);
            }
        });
    }
    
     if(ratings.find().count() <= 0){
        Assets.getText('ratings', function(err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            data = JSON.parse(data);
            for(var i= 0; i< data.length; i++){
                //console.log(data[i]);
                ratings.insert(data[i],check_keys=false);
            }
        });
    }
});

Meteor.users.allow({
    insert: function(userId, lugar) {
        return true;
    },
    update: function(userId, lugares, fields, modifier) {
        return true;
    },
    remove: function(userId, docs) {
        return true;
    }
});

Meteor.methods({

    userUpdate: function(id, name) {
        // Update account
        Meteor.users.update(id, {
            $set: {
                'emails[0].address': name,
                // profile: name
            }

        });

        return true;
        //Meteor.users.update({'_id' : 'aGgfP7GPe4fXLFWgL' }, { $set: { 'emails.0.name' : "b@b.b" }});

    },


    changePAssword: function(userId, oldPassword, newPassword) {

        Accounts.setPassword(userId, newPassword, false);
    },
    checkPassword: function(digest) {
        //check(digest, String);

        if (this.userId) {
            var user = Meteor.user();
            var password = { digest: digest, algorithm: 'sha-256' };
            var result = Accounts._checkPassword(user, password);
            return result.error == null;
        } else {
            return false;
        }
    },

    searchForUserByEmail: function(userEmail) {
        //window.alert(userEmail)

        var tmep = Meteor.users.find({ 'emails.0.address': userEmail }).fetch()[0];
        return tmep;

    },
    changeImage: function(newImagePath) {
        var id = Meteor.user()._id;
        Meteor.users.update({ '_id': id }, { $set: { 'emails.0.image': newImagePath } });
    },
    addFollower: function(follower, followee) {
        console.log(follower);
        console.log(followee);

        Meteor.users.update({ '_id': follower }, { $addToSet: { 'emails.0.followersArray': followee } });
        Meteor.users.update({ '_id': followee }, { $addToSet: { 'emails.0.followeesArray': follower } });
    },
    welcome: function(name) {


        var id = Meteor.users.find({ 'emails.address': 'a@a.a' }).fetch()[0]._id
        Meteor.users.update({ '_id': id }, { $set: { 'emails.address': 'abo@el.wak' } });
        //Meteor.users.insert({'bsbs': 'fsfs'});
        if (name == undefined || name.length <= 0) {
            throw new Meteor.Error(404, "Please enter your name");
        }

        return "Welcome " + Meteor.users.find({ 'emails.address': 'a@a.a' }).fetch()[0]._id;
    },
    'getMail': function(id, r_id) {
        mail = Meteor.users.findOne({ _id: id }).emails[0].address;
        return {
            mail: mail,
            review_id: r_id
        };
    },
    getRecommednations: function(id){
        var rating_records = ratings.find().fetch();
        // var user_ratings =                        object { movie : rating }
        user_reviews= Reviews.find({user_id: id, rating:{$ne: -1}}).fetch();
        var user_ratings= {};
        
        for(i= 0; i< user_reviews.length; i++){
            user_ratings[movies.findOne({_id: user_reviews[i].movie_id}).name]= user_reviews[i].rating;
        }

        console.log(user_ratings);

        // var user_ratings={
        //     "The Matrix":"3",
        //     "Avatar":"3",
        //     "Braveheart":"3",
        //     "Antz":"2"
        // };
        var similar_items=[]                      
        // console.log(rating_records[0]);


        
        for (i=0;i<rating_records.length;i++){ //loop on all critiques
            // Object.keys(rating_records[i]).forEach(function(key) {
            //     //movies rated by critique i 
            // });
            var db_keys= Object.keys(rating_records[i])
            var user_keys= Object.keys(user_ratings)
            var sim=[]            
            for(j=0;j<user_keys.length;j++){
                for(k=0;k<db_keys.length;k++){
                    if(db_keys[k]==user_keys[j]){
                        sim.push(db_keys[k]);
                    }
                }
            }
            similar_items.push(sim);
        }

        var eucDist=[]
        for(i=0;i<similar_items.length;i++){ //critique i
            var tempsum=0;
            var sim_i_user=similar_items[i]
            for(j=0;j<sim_i_user.length;j++){
                var p1= parseFloat(user_ratings[sim_i_user[j]]);
                var p2= parseFloat(rating_records[i][sim_i_user[j]]);
                tempsum+= Math.pow(p1-p2,2);
            }
            eucDist[i]=(1/(1+tempsum));
        }
        
        var minIndex = 1;
        var minValue=eucDist[0];
        for(i = 0 ; i<eucDist.length;i++){
            if(minValue>eucDist[i]){
                minValue=eucDist[i];
                minIndex= i;
            }
        }
        console.log(minIndex);
        var recommended =  Object.keys(rating_records[minIndex]);
        console.log(recommended.slice(3, Math.min(recommended.length, 15)));
        return recommended.slice(3, Math.min(recommended.length, 15));
    }

});
