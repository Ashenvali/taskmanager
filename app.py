from flask import Flask, render_template, request, jsonify

# Create Flask application
app = Flask(__name__)

# This list stores our tasks
tasks = []


# Open the website
@app.route("/")
def home():
    return render_template("index.html")


# Get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)


# Add a new task
@app.route("/tasks", methods=["POST"])
def add_task():

    # Get data from JavaScript
    data = request.json

    # Create a new task
    new_task = {
        "id": len(tasks) + 1,
        "title": data["title"],
        "completed": False
    }

    # Add task to list
    tasks.append(new_task)

    # Send task back to JavaScript
    return jsonify(new_task)


# Complete or uncomplete a task
@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):

    for task in tasks:

        if task["id"] == id:

            # Change True to False
            # or False to True
            task["completed"] = not task["completed"]

            return jsonify(task)

    return jsonify({"error": "Task not found"})


# Delete a task
@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):

    global tasks

    # Keep every task except the selected one
    tasks = [
        task for task in tasks
        if task["id"] != id
    ]

    return jsonify({
        "message": "Task deleted"
    })


# Start the application
if __name__ == "__main__":
    app.run(debug=True)