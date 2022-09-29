const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
	{
		pizzaName: {
			type: String,
			//can put true or a message for the required field option
			required: "You need to provide a pizza name!",
			trim: true,
		},
		createdBy: {
			type: String,
			required: true,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dateFormat(createdAtVal),
		},
		size: {
			type: String,
			required: true,
			//enum limits options for field to those in the listed array
			enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
			default: "Large",
		},
		toppings: [],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		// prevents virtuals from creating duplicate of _id as `id`
		id: false,
	}
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
	return this.comments.reduce(
		(total, comment) => total + comment.replies.length + 1,
		0
	);
});

const Pizza = model("Pizza", PizzaSchema);

module.exports = Pizza;
