# MODULES
from sqlalchemy import create_engine, Column, Integer, String, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask import Flask, request, jsonify
from flask_cors import CORS

# MAIN

app = Flask(__name__)
CORS(app)

# Replace 'username', 'password', 'host', 'database' with your MySQL credentials and database
DATABASE_URL = "mysql+mysqlconnector://username:password@host/database"

engine = create_engine(DATABASE_URL, echo=True)

# Describes the table, which you want to access
Base = declarative_base()
class Table(Base):
    __tablename__ = 'product_info'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    price = Column(Numeric(precision=10, scale=2))
    description = Column(String)

# Insert a row in the table (in the database)
@app.route('/insert_data', methods=['POST'])
def insert_data():
    try:

        data = request.json
        new_row = Table( name = data['name'], \
                            price = data['price'], \
                            description = data['description'])

        # Create a session to interact with the database
        Session = sessionmaker(bind = engine)
        session = Session()

        # Commit the row
        session.add(new_row)
        session.commit()

        return jsonify({"message": "Data inserted in table"}), 200

    except Exception as e:
        #print(f"Error in insert_data(): {str(e)}")
        return jsonify({"error": str(e)}), 500

# Retreives the table (from the database)
@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        # Create a session to interact with the database
        Session = sessionmaker(bind=engine)
        session = Session()

        # SELECT * FROM table;
        data = session.query(Table).all()

        result = []
        for row in data:
            result.append({"name": row.name, "price": float(row.price), \
                        "description": row.description})

        return jsonify(result), 200

    except Exception as e:
        #print(f"Error in get_data(): {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
