'use strict';

module.exports = function(app) {
	var asrsenal = require('../controllers/arsenalController');

	// asrsenal Routes
	app.route('/comments')
		.get(asrsenal.list_all_comments)
		.post(asrsenal.create_a_comment);

	app.route('/comments/:commentId')
		.get(asrsenal.read_a_comment)
		.put(asrsenal.update_a_comment)
		.delete(asrsenal.delete_a_comment);
	//--------------------------------------


	app.route('/news')
		.get(asrsenal.list_all_news)
		.post(asrsenal.create_a_news);

	app.route('/news/:newsId')
		.get(asrsenal.read_a_news)
		.put(asrsenal.update_a_news)
		.delete(asrsenal.delete_a_news);

		var cors = require('cors');
    app.use(cors());
    app.options('*', cors());
};
