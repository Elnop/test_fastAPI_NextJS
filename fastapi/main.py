from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo  import MongoClient

mongoClient = MongoClient(host="mongo", port=27017)

db = mongoClient.my_db
coll = db.documents

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def greet():
	return {"Hello": "World"}

class SaveDataModel(BaseModel):
    title: str
    text: str

@app.post("/save_document")
def save_data(data: SaveDataModel):
	coll.insert_one({"title": data.title, "text": data.text})
	return "ok"

@app.get("/get_documents")
def get_data():
	res = []
	for doc in coll.find():
		res.append({"title": doc.get("title"), "text": doc.get("text")})
	print(res)
	return {"document_list": res}

if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
