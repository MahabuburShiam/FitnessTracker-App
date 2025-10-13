//aiSuggestionController.js

const aiSuggestionController = require ('../services/aiSuggestionService');

exports.getAISuggestions = async (req, res) => {


    try{ const suggestions = await aiSuggestionService.getPersonalizedSuggestions(req.user.id);
    res.json({suggestions});
    } 

    catch(error) {
        res.status(500).json({error : error.message});
   

    }

};
















