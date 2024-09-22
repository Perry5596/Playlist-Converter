from flask import Flask, render_template, request, redirect, url_for, flash
import AppleToSpotify as ats

app = Flask(__name__)
app.secret_key = "8f5c72d0e0fa4f0bda5796e45fbb74f5"

@app.route('/')
def index():
    return render_template('index.html')  # Your input form will go here

@app.route('/convert', methods=['POST'])
def convert():
    if request.method == 'POST':
        apple_url = request.form['apple_url']
        try:
            spotify_playlist_url = ats.convert_apple_to_spotify(apple_url)  # Your conversion logic
            return render_template('result.html', spotify_url=spotify_playlist_url)
        except Exception as e:
            flash(f"An error occurred: {str(e)}")
            return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)