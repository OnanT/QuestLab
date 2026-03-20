import json
import psycopg2
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    connection_attempts = [
        {
            "host": os.getenv("POSTGRES_HOST", "postgres"),
            "database": os.getenv("POSTGRES_DB", "questlab_db"),
            "user": os.getenv("POSTGRES_USER", "turtle_guide"),
            "password": os.getenv("POSTGRES_PASSWORD", "QuestSecureTurtle"),
            "port": int(os.getenv("POSTGRES_PORT", 5432))
        },
        {
            "host": "localhost",
            "database": os.getenv("POSTGRES_DB", "questlab_db"),
            "user": os.getenv("POSTGRES_USER", "turtle_guide"),
            "password": os.getenv("POSTGRES_PASSWORD", "QuestSecureTurtle"),
            "port": 5433
        }
    ]
    
    for params in connection_attempts:
        try:
            conn = psycopg2.connect(**params)
            return conn
        except Exception:
            continue
            
    raise Exception("Could not connect to the database.")

def restore_html():
    # Mapping of Lesson Title -> Original HTML
    # Data extracted from seed-info files
    lessons_to_restore = {
        "The Ant and the Grasshopper – Future‑Tense Verbs": """<h2>The Ant and the Grasshopper: Using Future Tense Verbs</h2>
<p><strong>Grade Level:</strong> 3‑4&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Duration:</strong> 40‑45 minutes</p>

<h3>Learning Objectives</h3>
<ul>
<li>Identify future‑tense verbs in a story</li>
<li>Form future tense using “will” + base verb</li>
<li>Use “going to” to express future plans</li>
<li>Create sentences about future events using correct verb forms</li>
</ul>

<h3>Materials</h3>
<ul>
<li>The worksheet (Ant and Grasshopper story)</li>
<li>Pencil / eraser</li>
<li>Whiteboard or chart paper</li>
<li>Markers in different colors</li>
<li>Optional: pictures of an ant and a grasshopper</li>
</ul>

<h3>Warm‑Up (5 min)</h3>
<p><em>Teacher says:</em> “Today we are going to talk about things that haven’t happened yet — things we will do in the future.”</p>
<p><strong>Ask students:</strong></p>
<ul>
<li>What will you do after school today?</li>
<li>What will you eat for dinner tonight?</li>
<li>What are you going to do this weekend?</li>
</ul>
<p>Write a couple of answers on the board and underline the future‑tense verb.</p>

<h4>Example</h4>
<blockquote>
<p>I <u>will play</u> football. 
I <u>am going to eat</u> pizza.</p>
</blockquote>

<h3>Mini Lesson 1 – Future Tense with “Will” (10 min)</h3>
<p><strong>Pattern:</strong> will + base verb</p>
<table>
<tr><th>Base verb</th><th>Future (will)</th></tr>
<tr><td>work</td><td>will work</td></tr>
<tr><td>dance</td><td>will dance</td></tr>
<tr><td>gather</td><td>will gather</td></tr>
<tr><td>sing</td><td>will sing</td></tr>
<tr><td>have</td><td>will have</td></tr>
</table>
<p>Note: the verb after “will” stays in its base form (no –ed, –ing, –s).</p>

<h3>Guided Practice – Story Paragraph (10 min)</h3>
<p>Read the story aloud and fill in the blanks with “will” + base verb.</p>
<pre>
The Ant and the Grasshopper

One summer day, Grasshopper ______ (dance) and ______ (sing) in the field. …
Ant replies, “I ______ (gather) food for winter. You ______ (need) food too when winter comes.”
Grasshopper laughs, “Winter is far away! I ______ (worry) about that later. Right now, I ______ (enjoy) the sunshine!”
When winter arrives, Grasshopper ______ (be) cold and hungry.
Ant ______ (have) plenty of food to eat.
</pre>

<h3>Mini Lesson 2 – “Going to” for Future Plans (5 min)</h3>
<p><strong>Pattern:</strong> am/is/are + going to + base verb</p>
<ul>
<li>I am going to study tonight.</li>
<li>She is going to visit her grandmother.</li>
<li>They are going to play football after school.</li>
</ul>

<h3>Independent Practice (10 min)</h3>
<p><strong>Exercise 1 – Change to Future Tense with “Will”</strong></p>
<ol>
<li>The ant works hard. → __________</li>
<li>The grasshopper sings a song. → __________</li>
<li>Winter comes soon. → __________</li>
<li>I gather food. → __________</li>
<li>They dance in the field. → __________</li>
</ol>

<p><strong>Exercise 2 – Complete with “Going to”</strong></p>
<ol>
<li>I ______ (study) for my test tomorrow.</li>
<li>The grasshopper ______ (be) hungry in winter.</li>
<li>We ______ (visit) the zoo next week.</li>
<li>She ______ (help) her mother today.</li>
<li>They ______ (play) outside after lunch.</li>
</ol>

<h3>Closing Activity – Future Plans Share (5 min)</h3>
<p>Students share sentences such as:</p>
<ul>
<li>“This weekend I will ___.”</li>
<li>“Next year I am going to ___.”</li>
<li>“When I grow up I will ___.”</li>
</ul>

<h3>Assessment & Differentiation</h3>
<p>Formative checks during guided practice, worksheet review, and oral sharing.</p>

<h3>Key Vocabulary</h3>
<table>
<tr><th>Word</th><th>Meaning</th></tr>
<tr><td>Future tense</td><td>Verb form that talks about actions that haven’t happened yet</td></tr>
<tr><td>Will</td><td>Helper word used to make future tense (will + base verb)</td></tr>
<tr><td>Going to</td><td>Phrase used to talk about future plans or intentions</td></tr>
<tr><td>Base verb</td><td>The simple form of a verb (no -ed, -ing, or -s)</td></tr>
</table>

<p><strong>Moral of the Story:</strong> “It is best to prepare for the future and work hard today. What we do today will affect what happens tomorrow!”</p>

<p><em>Homework (optional):</em> Write five sentences about what you will do to prepare for your future, using both “will” and “going to”.</p>""",

        "How to Write a Paragraph – Using Hooks": """<h2>What Is a Hook?</h2>
<p>A hook is the first sentence in your writing. Its job is to grab the reader's attention, just like a fishing hook grabs a fish 🐟.</p>

<h3>Types of Hooks</h3>
<ul>
  <li><strong>Question Hook</strong> – Ask a question that makes the reader think.</li>
  <li><strong>Description Hook</strong> – Paint a picture with words.</li>
  <li><strong>Surprising Fact Hook</strong> – Share something the reader probably doesn't know.</li>
  <li><strong>Exclamation / Onomatopoeia Hook</strong> – Use exciting or sound words.</li>
</ul>

<h3>Step‑by‑Step Paragraph Plan</h3>
<ol>
  <li>Hook (sentence 1)</li>
  <li>Tell what the topic is about (sentence 2)</li>
  <li>Add a detail (sentence 3)</li>
  <li>Closing sentence (sentence 4)</li>
</ol>

<h3>Example Paragraph</h3>
<p><strong>Question Hook – "My Favorite Pet":</strong></p>
<p><em>Have you ever had a pet that makes you feel happy? My favorite pet is my dog. He likes to play with me and run around the yard. My dog makes me feel happy and loved.</em></p>

<div class="activity">
<h3>Practice Activity</h3>
<p>Choose one hook type and write a 4-sentence paragraph about your favorite food, game, or place!</p>
</div>""",

        "Introduction to Fractions": """<h2>What is a Fraction?</h2>
<p>A fraction represents a part of a whole. It has two numbers:</p>
<ul>
  <li><strong>Numerator</strong> (top number) – How many parts we have</li>
  <li><strong>Denominator</strong> (bottom number) – How many equal parts the whole is divided into</li>
</ul>

<h3>Example</h3>
<p>If you cut a pizza into 8 equal slices and eat 3 slices, you have eaten <strong>3/8</strong> of the pizza.</p>

<h3>Visual Representation</h3>
<p>Draw a circle and divide it into equal parts to show different fractions!</p>

<div class="activity">
<h3>Practice Activity</h3>
<p>Draw and shade fractions: 1/2, 1/4, 3/4, and 2/3</p>
</div>""",

        "The Kalinago People of Dominica": """<h2>Who Are the Kalinago People?</h2>
<p>The Kalinago (also known as Caribs) are the indigenous people of Dominica. They have lived on the island for over 600 years!</p>

<h3>The Kalinago Territory</h3>
<p>Today, the Kalinago have their own territory on the northeast coast of Dominica. It covers 3,700 acres and is the last remaining indigenous territory in the Caribbean.</p>

<h3>Cultural Heritage</h3>
<ul>
  <li><strong>Traditional Crafts</strong> – Basket weaving using natural materials</li>
  <li><strong>Canoe Building</strong> – Traditional boat-making skills</li>
  <li><strong>Language</strong> – Preserving their native language and stories</li>
  <li><strong>Food</strong> – Traditional cassava bread and cooking methods</li>
</ul>

<h3>Important Facts</h3>
<p>The Kalinago Barana Autê is a cultural village where visitors can learn about Kalinago traditions and way of life.</p>

<div class="activity">
<h3>Research Activity</h3>
<p>Research one aspect of Kalinago culture (crafts, food, or language) and create a short presentation.</p>
</div>""",

        "Mastering the Present Continuous Tense": """<h2>The Present Continuous Tense: What is happening right now?</h2>
<p><strong>Grade Level:</strong> 3‑5&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Duration:</strong> 45 minutes</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand when to use the present continuous tense.</li>
<li>Form the tense correctly using <em>am/is/are</em> + <em>verb-ing</em>.</li>
<li>Identify spelling changes when adding "-ing".</li>
<li>Differentiate between the simple present and present continuous.</li>
</ul>

<h3>1. What is the Present Continuous?</h3>
<p>We use the present continuous tense to talk about actions that are <strong>happening right now</strong>, at the very moment we are speaking.</p>
<p><em>Example:</em> "I <strong>am reading</strong> a lesson on the computer."</p>

<h3>2. How to Form it</h3>
<p>The formula is simple:</p>
<div style="background: #f0fdf4; padding: 15px; border-radius: 10px; border: 1px solid #bbf7d0; margin-bottom: 20px;">
    <strong>Subject + am/is/are + verb + -ing</strong>
</div>

<table>
<tr><th>Subject</th><th>Helping Verb (To Be)</th><th>Verb + -ing</th></tr>
<tr><td>I</td><td>am</td><td>eating</td></tr>
<tr><td>He / She / It</td><td>is</td><td>playing</td></tr>
<tr><td>You / We / They</td><td>are</td><td>running</td></tr>
</table>

<h3>3. Spelling Rules for "-ing"</h3>
<p>Most verbs just add "-ing", but watch out for these special cases:</p>
<ul>
<li><strong>Verbs ending in -e:</strong> Drop the 'e' and add -ing. (e.g., Make -> Making)</li>
<li><strong>Verbs ending in CVC (Consonant-Vowel-Consonant):</strong> Double the last consonant. (e.g., Sit -> Sitting, Run -> Running)</li>
<li><strong>Most other verbs:</strong> Just add -ing. (e.g., Walk -> Walking, Read -> Reading)</li>
</ul>

<h3>4. Signal Words</h3>
<p>When you see these words in a sentence, it's a big hint that you should use the present continuous:</p>
<ul>
<li>Now</li>
<li>At the moment</li>
<li>Right now</li>
<li>Look! / Listen!</li>
</ul>

<h3>Guided Practice</h3>
<p>Look around the room. What are people doing? Write three sentences using the present continuous.</p>
<ol>
<li>My friend __________ (draw) a picture.</li>
<li>The teacher __________ (talk) to the class.</li>
<li>We __________ (learn) about grammar.</li>
</ol>

<p><strong>Remember:</strong> Don't forget the helping verb (am, is, or are)! Without it, your sentence is incomplete.</p>""",

        "The Power of Capital Letters": """<h2>Capital Letters: When to use them?</h2><p>Capital letters are like "VIP" markers for words. They tell us which words are important!</p><h3>Always capitalize:</h3><ul><li>The first word of a sentence. (<strong>T</strong>he sun is out.)</li><li>The word "I". (He and <strong>I</strong> are friends.)</li><li>Proper nouns: names of people, places, days, and months. (<strong>S</strong>t. <strong>K</strong>itts, <strong>N</strong>evis, <strong>A</strong>lexander <strong>H</strong>amilton, <strong>M</strong>onday, <strong>J</strong>anuary.)</li></ul>""",

        "Punctuation: The Traffic Lights of Writing": """<h2>Punctuation Marks: Helping us read better!</h2><p>Punctuation marks tell us when to stop, slow down, or show excitement.</p><h3>The Big Four:</h3><ul><li><strong>Full Stop (.)</strong>: Used at the end of a statement. (I like fish<strong>.</strong>)</li><li><strong>Question Mark (?)</strong>: Used when asking something. (Where are you going<strong>?</strong>)</li><li><strong>Exclamation Mark (!)</strong>: Used for strong feelings or shouting. (Look out<strong>!</strong>)</li><li><strong>Comma (,)</strong>: Used to pause or separate items in a list. (I like apples<strong>,</strong> bananas<strong>,</strong> and grapes.)</li></ul>""",

        "Dancing Vowels: Diphthongs": """<h2>Diphthongs: Two sounds in one!</h2><p>A diphthong is a sound formed by the combination of two vowels in a single syllable.</p><h3>Common Diphthongs:</h3><ul><li><strong>or:</strong> fork, horn, storm</li><li><strong>oy:</strong> toy, boy, joy</li><li><strong>ow:</strong> cow, town, clown</li><li><strong>ou:</strong> house, cloud, sound</li><li><strong>aw:</strong> claw, saw, draw</li></ul>""",

        "The Secret Life of the Letter Y": """<h2>The Letter Y: A master of disguise!</h2><p>Did you know the letter Y can be a consonant OR a vowel?</p><h3>Y as a Consonant:</h3><p>When Y is at the <strong>beginning</strong> of a word or syllable, it acts as a consonant.</p><ul><li><strong>Y</strong>ellow, <strong>Y</strong>es, <strong>Y</strong>ard</li></ul><h3>Y as a Vowel:</h3><p>When Y is in the <strong>middle</strong> or at the <strong>end</strong> of a word, it acts as a vowel (making the "i" or "e" sound).</p><ul><li>Sk<strong>y</strong>, Fl<strong>y</strong> (sounds like long i)</li><li>Happ<strong>y</strong>, Cand<strong>y</strong> (sounds like long e)</li><li>Gym (sounds like short i)</li></ul>""",

        "S Blends and L Blends: Joining Sounds": """<h2>Blends: Sounds that stick together!</h2><p>A blend is when two or more consonants are joined together, but you can still hear each sound.</p><h3>S Blends:</h3><ul><li><strong>sn</strong>ake, <strong>sm</strong>all, <strong>sk</strong>ate, <strong>sc</strong>hool, <strong>sp</strong>oon, <strong>st</strong>ar</li></ul><h3>L Blends:</h3><ul><li><strong>fl</strong>ower, <strong>pl</strong>ant, <strong>sl</strong>ide, <strong>gl</strong>ass, <strong>bl</strong>ack</li></ul>""",

        "Syllabication: The Beats of Words": """<h2>Syllables: Word beats!</h2><p>A syllable is a part of a word that contains a single vowel sound. We can "clap" the syllables in a word.</p><h3>How to break words:</h3><ul><li><strong>Dog:</strong> 1 syllable (dog)</li><li><strong>Ti-ger:</strong> 2 syllables (ti-ger)</li><li><strong>Ba-na-na:</strong> 3 syllables (ba-na-na)</li></ul><h3>Rules:</h3><p>Every syllable must have at least one vowel sound!</p>""",

        "Compound Words: Two in One!": """<h2>Compound Words: Putting words together!</h2><p>A compound word is made when two smaller words are joined together to form a new word with a new meaning.</p><h3>Examples:</h3><ul><li><strong>Sun + Flower = Sunflower</strong></li><li><strong>Rain + Bow = Rainbow</strong></li><li><strong>Foot + Ball = Football</strong></li><li><strong>Star + Fish = Starfish</strong></li></ul>""",

        "Homographs: Same Spelling, Different Meaning": """<h2>Homographs: Twins that act differently!</h2><p>Homographs are words that are spelled the same but have different meanings.</p><h3>Examples:</h3><ul><li><strong>Bat:</strong> A piece of sports equipment OR a flying animal.</li><li><strong>Bark:</strong> The outer layer of a tree OR the sound a dog makes.</li><li><strong>Bank:</strong> A place to keep money OR the side of a river.</li><li><strong>Watch:</strong> To look at something OR a small clock you wear on your wrist.</li></ul>""",

        "Similes: Comparisons using Like or As": """<h2>Similes: Making writing colorful!</h2><p>A simile compares two things using the words <strong>"like"</strong> or <strong>"as"</strong>.</p><h3>Examples:</h3><ul><li>As brave <strong>as</strong> a lion.</li><li>Eat <strong>like</strong> a pig.</li><li>As cool <strong>as</strong> a cucumber.</li><li>Fast <strong>like</strong> the wind.</li></ul><p>Similes help us paint a picture in the reader's mind!</p>""",

        "Indefinite Articles: A or An?": """<h2>A and An: Choosing the right one!</h2><p>We use "a" and "an" before singular nouns. But how do we know which one to pick?</p><h3>The Rule:</h3><ul><li>Use <strong>"an"</strong> before words that start with a <strong>vowel sound</strong> (a, e, i, o, u).<br><em><strong>An</strong> apple, <strong>an</strong> egg, <strong>an</strong> igloo, <strong>an</strong> orange, <strong>an</strong> umbrella.</em></li><li>Use <strong>"a"</strong> before words that start with a <strong>consonant sound</strong>.<br><em><strong>A</strong> ball, <strong>a</strong> cat, <strong>a</strong> dog, <strong>a</strong> fish.</em></li></ul>""",

        "Simple Present Tense: Everyday Actions": """<h2>Simple Present Tense: What we do every day!</h2><p>We use the simple present tense to talk about habits, routines, and facts.</p><h3>Rules:</h3><ul><li>For <strong>I, You, We, They</strong>: Use the base form of the verb. (I play)</li><li>For <strong>He, She, It</strong>: Add "-s" or "-es" to the base form. (She plays)</li></ul>""",

        "Simple Past Tense: What Happened Before!": """<h2>Simple Past Tense: Looking back!</h2><p>We use the simple past tense to talk about actions that are finished.</p><h3>Rules for Regular Verbs:</h3><ul><li>Most verbs: Add "-ed". (Walk -> Walked)</li><li>Verbs ending in -e: Just add "-d". (Like -> Liked)</li><li>Verbs ending in -y (preceded by a consonant): Change -y to -i and add -ed. (Cry -> Cried)</li></ul>""",

        "Irregular Past Tense: The Rule Breakers!": """<h2>Irregular Verbs: They don’t follow the rules!</h2><p>Some verbs do not add "-ed" in the past tense. You have to memorize them!</p><h3>Examples:</h3><ul><li>Go -> Went</li><li>See -> Saw</li><li>Eat -> Ate</li><li>Drink -> Drank</li><li>Run -> Ran</li></ul>""",

        "Past Continuous Tense: Actions in Progress in the Past": """<h2>Past Continuous: What was happening?</h2><p>We use the past continuous to talk about actions that were happening at a specific time in the past.</p><h3>The Formula:</h3><div style="background: #fdf2f8; padding: 15px; border-radius: 10px; border: 1px solid #fbcfe8; margin-bottom: 20px;"><strong>Subject + was/were + verb + -ing</strong></div><ul><li><strong>I, He, She, It:</strong> was + verb-ing</li><li><strong>You, We, They:</strong> were + verb-ing</li></ul>""",

        "Subject-Verb Agreement: Perfect Pairs!": """<h2>Subject-Verb Agreement: Matching your subjects and verbs!</h2><p>The subject and verb in a sentence must "agree" or match in number.</p><h3>Key Rules:</h3><ul><li><strong>Singular subjects</strong> need singular verbs (often ending in -s).<br><em>The bird sings.</em></li><li><strong>Plural subjects</strong> need plural verbs (no -s).<br><em>The birds sing.</em></li></ul>""",

        "Painting with Words: Descriptive Writing": """<h2>Descriptive Writing: Use your senses!</h2><p>Descriptive writing helps the reader "see", "hear", "smell", "taste", and "feel" what you are writing about.</p><h3>The 5 Senses:</h3><ul><li><strong>Sight:</strong> What does it look like? (Colors, size, shape)</li><li><strong>Sound:</strong> What does it sound like? (Quiet, loud, buzzing)</li><li><strong>Smell:</strong> What does it smell like? (Sweet, fresh, stinky)</li><li><strong>Taste:</strong> What does it taste like? (Sour, sugary, salty)</li><li><strong>Touch:</strong> What does it feel like? (Rough, smooth, soft)</li></ul><h3>Adjectives:</h3><p>Use "wow" words! Instead of "big", use "enormous". Instead of "nice", use "wonderful".</p>""",

        "Spelling Secrets: Rules to Remember": """<h2>Spelling Rules: Level Up your Writing!</h2><p>Rules help us spell words correctly even when they are tricky.</p><h3>Rule 1: Magic E</h3><p>When "e" is at the end, it makes the vowel say its name.<br><em>Example: Hop -> Hope, Kit -> Kite</em></p><h3>Rule 2: Doubling Consonants</h3><p>If a word is 1 syllable and ends in CVC (Consonant-Vowel-Consonant), double the last letter before adding -ing.<br><em>Example: Run -> Running, Sit -> Sitting</em></p><h3>Rule 3: Dropping the E</h3><p>If a word ends in "e", drop it before adding -ing.<br><em>Example: Bake -> Baking, Smile -> Smiling</em></p>""",

        "Addition with Regrouping: Carrying Over": """<h2>Addition with Regrouping: When 10 is too many!</h2><p>When we add numbers in a column and the sum is 10 or more, we "regroup" or "carry over" to the next column.</p><h3>Example: 25 + 18</h3><ul><li><strong>Step 1:</strong> Add the ones: 5 + 8 = 13.</li><li><strong>Step 2:</strong> Write down the 3 and "carry" the 1 to the tens column.</li><li><strong>Step 3:</strong> Add the tens: 2 + 1 + 1 (carried) = 4.</li><li><strong>Final Answer:</strong> 43</li></ul>""",

        "Subtraction with Regrouping: Borrowing Power": """<h2>Subtraction with Regrouping: Borrowing from friends!</h2><p>When the top number in a column is smaller than the bottom number, we "borrow" or "regroup" from the next column.</p><h3>Example: 42 - 15</h3><ul><li><strong>Step 1:</strong> Look at the ones: 2 - 5? We can't do that!</li><li><strong>Step 2:</strong> Borrow 1 ten from the 4. Now the 4 becomes 3.</li><li><strong>Step 3:</strong> Give the ten to the 2. Now the 2 becomes 12.</li><li><strong>Step 4:</strong> Subtract the ones: 12 - 5 = 7.</li><li><strong>Step 5:</strong> Subtract the tens: 3 - 1 = 2.</li><li><strong>Final Answer:</strong> 27</li></ul>""",

        "Mastering Multiplication": """<h2>Multiplication: Fast Addition!</h2><p>Multiplication is adding the same number many times.</p><h3>Multiplying by 1 Digit:</h3><p>23 x 3 = ?<br>Multiply 3 x 3 = 9. Then 3 x 20 = 60. Result: 69.</p><h3>Multiplying by 2 Digits (The Big Leap):</h3><p>When multiplying by a 2-digit number (like 12), remember to use a placeholder zero!</p><ul><li>Multiply by the ones place.</li><li>Add a 0 placeholder.</li><li>Multiply by the tens place.</li><li>Add the results together.</li></ul>""",

        "Math in the Real World: Word Problems": """<h2>Word Problems: Solving Mysteries!</h2><p>Word problems use stories to ask math questions. You need to look for "Clue Words"!</p><h3>Addition Clue Words:</h3><ul><li>Total</li><li>Sum</li><li>Altogether</li><li>Plus</li><li>In all</li></ul><h3>Subtraction Clue Words:</h3><ul><li>Difference</li><li>Left</li><li>Remain</li><li>How many more</li><li>Fewer</li></ul>""",

        "Exploring 3D Shapes: Solid Figures": """<h2>3D Shapes: Shapes you can hold!</h2><p>3D shapes are solid objects. They have length, width, and height.</p><h3>Common 3D Shapes:</h3><ul><li><strong>Cube:</strong> Like a dice. It has 6 square faces.</li><li><strong>Sphere:</strong> Like a ball. It is perfectly round.</li><li><strong>Cylinder:</strong> Like a soda can. It has two circular bases.</li><li><strong>Cone:</strong> Like a party hat. It has a circular base and a point.</li><li><strong>Pyramid:</strong> Like the ones in Egypt. It has a flat base and triangular sides.</li></ul><h3>Parts of a 3D Shape:</h3><ul><li><strong>Face:</strong> The flat surface.</li><li><strong>Edge:</strong> Where two faces meet.</li><li><strong>Vertex:</strong> The corner where edges meet.</li></ul>""",

        "Symmetry: Perfect Balance": """<h2>Symmetry: Mirror Images!</h2><p>Symmetry is when one shape becomes exactly like another if you flip, slide, or turn it.</p><h3>Line of Symmetry:</h3><p>An imaginary line where you could fold the image and have both halves match exactly.</p><ul><li>A butterfly is symmetrical.</li><li>A square has 4 lines of symmetry.</li><li>A circle has infinite lines of symmetry!</li></ul>""",

        "Congruent: Exactly the Same!": """<h2>Congruent Shapes: Identical Twins!</h2><p>Congruent means that two shapes are the <strong>same size</strong> and the <strong>same shape</strong>.</p><h3>Key Rule:</h3><p>If you can place one shape on top of another and they match perfectly, they are congruent.</p><ul><li>They can be turned or flipped, but they must be the same size!</li></ul>""",

        "How We Hear: The Ear": """<h2>The Sense of Hearing</h2><p>Our ears are the sensory organs we use for hearing.</p><h3>Components of the Ear:</h3><ul><li><strong>Outer Ear:</strong> Catches the sound.</li><li><strong>Ear Canal:</strong> The tunnel sound travels through.</li><li><strong>Eardrum:</strong> Vibrates when sound hits it.</li><li><strong>Inner Ear:</strong> Sends signals to the brain.</li></ul><h3>Protecting Your Ears:</h3><ul><li>Avoid very loud noises.</li><li>Never put sharp objects in your ears.</li><li>Use earplugs in noisy places.</li></ul><h3>Hearing Impairment:</h3><p>Some people have trouble hearing (hearing impairment) or cannot hear at all (deaf). They may use <strong>hearing aids</strong> or <strong>sign language</strong>.</p>""",

        "Vibrations and Volume: Understanding Sound": """<h2>What is Sound?</h2><p>Sound is a form of energy made by <strong>vibrations</strong>.</p><h3>How Sound Moves:</h3><p>Sound travels in waves through solids, liquids, and gases (air). It moves fastest through solids!</p><h3>Pitch (High and Low):</h3><ul><li><strong>High Pitch:</strong> Sounds like a whistle or a bird chirping.</li><li><strong>Low Pitch:</strong> Sounds like a drum or a cow mooing.</li></ul><p>Pitch depends on how fast something vibrates. Fast vibrations = High pitch.</p>""",

        "Hot Stuff: Exploring Heat": """<h2>What is Heat?</h2><p>Heat is a form of energy that moves from a warmer object to a cooler one.</p><h3>Producing Heat:</h3><ul><li><strong>The Sun:</strong> Our main source of heat.</li><li><strong>Friction:</strong> Rubbing your hands together.</li><li><strong>Burning:</strong> Fire, stoves, candles.</li><li><strong>Electricity:</strong> Heaters, toasters.</li></ul><h3>Conductors and Insulators:</h3><ul><li><strong>Conductor:</strong> A material that lets heat pass through easily (e.g., Metal).</li><li><strong>Insulator (Non-conductor):</strong> A material that does NOT let heat pass through easily (e.g., Wood, Plastic, Rubber).</li></ul>""",

        "Who Eats Whom: Food Chains": """<h2>Food for Life</h2><p>All living things need energy from food to survive.</p><h3>Classifying Animals:</h3><ul><li><strong>Herbivore:</strong> Eats only plants (e.g., Green Monkey, Cow).</li><li><strong>Carnivore:</strong> Eats only meat (e.g., Shark).</li><li><strong>Omnivore:</strong> Eats both plants and meat (e.g., Humans, Pigs).</li></ul><h3>Food Chains:</h3><p>A food chain shows how energy passes from one living thing to another.</p><p><strong>Example:</strong> Grass (Producer) &rarr; Grasshopper (Consumer) &rarr; Frog (Consumer) &rarr; Snake (Predator).</p><h3>Important Terms:</h3><ul><li><strong>Predator:</strong> An animal that hunts other animals.</li><li><strong>Prey:</strong> An animal that is hunted and eaten.</li><li><strong>Scavenger:</strong> Eats animals that are already dead (e.g., Vulture).</li></ul>""",

        "Celebrating Together: Special Days": """<h2>Celebrations in St. Kitts and Nevis</h2><p>We celebrate many special days throughout the year with our family and friends.</p><h3>Christmas (December 25th):</h3><ul><li>Celebrating the birth of Jesus.</li><li>Traditions: Decorating trees, giving gifts, eating "black cake" and "sorrel".</li><li>St. Kitts Carnival (Sugar Mas) also happens during this time.</li></ul><h3>New Year's Day (January 1st):</h3><ul><li>The start of a new calendar year.</li><li>Traditions: Fireworks, church services, and family gatherings.</li></ul><h3>Valentine's Day (February 14th):</h3><ul><li>A day to show love and kindness to others.</li><li>Traditions: Giving cards, flowers, and chocolates.</li></ul>""",

        "Buying and Selling: Goods and Services": """<h2>Economics in our Community</h2><p>People work to provide things that others need or want.</p><h3>Goods:</h3><p>Things that are made or grown that you can touch and keep.</p><ul><li>Examples: Books, bread, toys, clothes, fruits from the market.</li></ul><h3>Services:</h3><p>Work that someone does for someone else.</p><ul><li>Examples: A hair cut, fixing a car, teaching a lesson, a doctor's checkup.</li></ul><h3>Producers and Consumers:</h3><ul><li><strong>Producer:</strong> Someone who makes goods or provides services.</li><li><strong>Consumer:</strong> Someone who buys or uses goods and services.</li></ul>""",

        "Connecting People: Communication": """<h2>What is Communication?</h2><p>Communication is the way we share information, ideas, and feelings with others.</p><h3>Traditional (Old) Ways:</h3><ul><li>Letters (Snail mail)</li><li>Smoke signals</li><li>Drums</li><li>Face-to-face talking</li></ul><h3>Modern (New) Ways:</h3><ul><li>Mobile phones (Texting, calling)</li><li>Email</li><li>Social Media</li><li>Video calls (Zoom, WhatsApp)</li></ul><h3>Communication Centers in SKN:</h3><ul><li>Post Offices</li><li>ZIZ Broadcasting Corporation</li><li>Telecommunication offices (Flow, Digicel)</li></ul>""",

        "On the Move: Transportation": """<h2>What is Transportation?</h2><p>Transportation is the movement of people and goods from one place to another.</p><h3>Means of Transportation:</h3><ul><li><strong>Land:</strong> Cars, buses, bicycles, donkeys (traditional).</li><li><strong>Sea:</strong> Boats, ferries (like the Sea Bridge), ships.</li><li><strong>Air:</strong> Airplanes, helicopters.</li></ul><h3>History:</h3><p>Long ago, people used animals like horses and donkeys. Today, we use fast engines in cars and planes.</p>""",

        "Safety First: Road Rules": """<h2>Staying Safe on the Road</h2><p>Rules keep us safe when we are walking or driving.</p><h3>Important Rules:</h3><ul><li>Look both ways before crossing.</li><li>Use the <strong>pedestrian crossing</strong> (Zebra crossing).</li><li>Walk on the sidewalk.</li><li>Wear your seatbelt in the car.</li><li>Never drink and drive.</li></ul><h3>Traffic Signs:</h3><ul><li><strong>Red Light:</strong> STOP.</li><li><strong>Yellow Light:</strong> SLOW DOWN / PREPARE TO STOP.</li><li><strong>Green Light:</strong> GO.</li><li><strong>Stop Sign:</strong> Octagon shape, means stop completely.</li></ul>""",

        "Heroes of our Islands: Hamilton and Wells": """<h2>Places of Memory: Alexander Hamilton and Nathaniel Wells</h2><p>Our islands have a rich history with people who did great things.</p><h3>Alexander Hamilton:</h3><ul><li>Born in <strong>Nevis</strong>.</li><li>He was one of the Founding Fathers of the United States.</li><li>The <strong>Alexander Hamilton Museum</strong> in Charlestown is his birthplace.</li></ul><h3>Nathaniel Wells:</h3><ul><li>The son of a plantation owner and an enslaved woman in St. Kitts.</li><li>He became Britain's first Black sheriff.</li><li>He is remembered for his success and for helping others.</li></ul>""",

        "Towns, Villages, and Neighborhoods": """<h2>What is a Community?</h2><p>A community is a place where people live, work, and play together.</p><h3>Large vs Small:</h3><ul><li><strong>Town:</strong> A large community with many houses, shops, and people. (Example: Basseterre, Charlestown)</li><li><strong>Village:</strong> A smaller community with fewer people.</li></ul><h3>Features:</h3><ul><li><strong>Natural Features:</strong> Made by nature. (Mountains, rivers, beaches, ghauts)</li><li><strong>Man-made Features:</strong> Made by people. (Bridges, roads, buildings, parks)</li></ul>""",

        "Community Workers, Needs, and Wants": """<h2>Living in a Community</h2><h3>Needs vs Wants:</h3><ul><li><strong>Needs:</strong> Things we MUST have to survive. (Food, water, shelter, clothing)</li><li><strong>Wants:</strong> Things we would LIKE to have but don't need to survive. (Toys, candy, video games)</li></ul><h3>Community Workers:</h3><p>People who have jobs that help everyone in the community.</p><ul><li><strong>Police Officer:</strong> Keeps us safe. (Tools: Handcuffs, radio)</li><li><strong>Firefighter:</strong> Puts out fires. (Tools: Hose, ladder)</li><li><strong>Doctor/Nurse:</strong> Heals the sick. (Tools: Stethoscope)</li><li><strong>Teacher:</strong> Helps us learn. (Tools: Books, whiteboard)</li></ul>"""
    }

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        print(f"Starting restoration of {len(lessons_to_restore)} lessons...")
        
        updated_count = 0
        for title, html in lessons_to_restore.items():
            cur.execute(
                "UPDATE lessons SET content_html = %s WHERE title = %s",
                (html, title)
            )
            if cur.rowcount > 0:
                updated_count += 1
                print(f"✅ Restored: {title}")
            else:
                # If title doesn't match exactly, maybe it has different quotes or invisible chars
                # Let's try a LIKE match as fallback
                cur.execute(
                    "UPDATE lessons SET content_html = %s WHERE title ILIKE %s",
                    (html, f"%{title}%")
                )
                if cur.rowcount > 0:
                    updated_count += 1
                    print(f"✅ Restored (fuzzy match): {title}")
                else:
                    print(f"❌ Not found in DB: {title}")

        conn.commit()
        print(f"\nRestoration complete! {updated_count} lessons updated.")

    except Exception as e:
        print(f"Error during restoration: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    restore_html()
