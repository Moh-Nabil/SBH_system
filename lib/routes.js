
 
Router.route('/movie/:_id', function() {
    var item= movies.findOne({_id: this.params._id});
    Session.set('item', item);
    
    this.render('movie');
});

Router.route('/', function () {
  // render the Home template with a custom data context
  this.render('home', {data: {title: 'My Title'}});
});

// when you navigate to "/searchResult" automatically render the template named "searchResult".
Router.route('/searchResult');

Router.route('/profile');
// when you navigate to "/two" automatically render the template named "Two".
Router.route('/catalog');
  
Router.route('/visitUserProfile');  