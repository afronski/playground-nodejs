var Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Template.body.helpers({
        tasks: function () {
            return Tasks.find({}, { sort: { createdAt: -1 } });
        }
    });

    Template.body.events({
        "submit .new-task": function (event) {
            var text = event.target.text.value;

            Tasks.insert({
                text: text,
                createdAt: new Date()
            });

            event.target.text.value = "";

            return false;
        },

        "click .toggle-checked": function () {
            Tasks.update(this._id, { $set: { checked: !this.checked } });
        },

        "click .delete": function () {
            Tasks.remove(this._id);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {});
}
