$.get('/api/1', function(data){
	for(var i=0;i<data.length;i++){
		$('#out').html(data[i]);
	}
});