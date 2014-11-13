PixelsCollection = new Meteor.Collection("pixels");

var validateBoardUser = function(ownerId) {
    var userId = Meteor.userId();
    if (!userId || ownerId != userId) {
        throw new Meteor.Error('board-rights', 'You are not allowed to draw on this board');
    }
};

Meteor.methods({
    addPixel: function(attributes) {
        check(attributes, {
            x: Match.Integer,
            y: Match.Integer,
            color: String,
            boardId: String,
            ownerId: String
        });

        validateBoardUser(attributes.ownerId);

        PixelsCollection.upsert(
            {
                x: attributes.x,
                y: attributes.y,
                boardId: attributes.boardId
            },
            {$set: {color : attributes.color, x: attributes.x, y: attributes.y, boardId: attributes.boardId}}
        );

        console.log('Created pixel '+attributes.x+':'+attributes.y+' - '+new Date()); // TODO Display log only in dev mode
    },
    removePixel: function(attributes) {
        check(attributes, {
            x: Match.Integer,
            y: Match.Integer,
            boardId: String,
            ownerId: String
        });

        validateBoardUser(attributes.ownerId);

        // TODO Refactor with addPixel
        var userId = Meteor.userId();
        if (!userId || attributes.ownerId != userId) {
            throw new Meteor.Error('board-rights', 'You are not allowed to draw on this board');
        }

        var deleted = PixelsCollection.remove({x: attributes.x, y: attributes.y, boardId: attributes.boardId});

        console.log('Deleted pixels ('+deleted+')'+new Date());
    }
});