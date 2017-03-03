if (Meteor.isClient) {
	Template.searchForm.events({
		'submit form': function(){
			event.preventDefault();
			searchData = event.target.searchValue.value;
			
			Meteor.call("queryGames", searchData, function(error, results) {
				var parsed = JSON.parse(results.content);
				var arr = [];
				for (var x in parsed) {
					arr.push(parsed[x].name);
				}
				Session.set("response", arr);
			});
		}
	});
		
	Template.gameList.events({
		'click .game': function(){
			var gameId = this;
			console.log("clicked " + gameId);
		}
	});
		
	Template.gameList.helpers({
		'getName': function(){
			return Session.get("response");
		}
	});
}

if (Meteor.isServer) {
	Meteor.methods({
        queryGames: function (searchData){
            this.unblock();
			var replaced = searchData.split(' ').join('+');
            return HTTP.call( 'GET', 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=20&offset=0&search=' + replaced, {
				headers: {
					'X-Mashape-Key': Meteor.settings.IGDBkey,
					'Accept': 'application/json'
				}
			});
        }
    });
}