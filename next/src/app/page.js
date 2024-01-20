"use client"

import { useState } from "react";
import styles from './page.module.css'

function CreateNewDocument({getDocuments}) {
	async function onSubmit(event) {
		event.preventDefault()

		const formData = new FormData(event.target)
		const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
		try {
			const response = await fetch('http://localhost:8000/save_document', {
				method: 'POST',
				headers: {
                    'Content-Type': 'application/json',
                },
				body: JSON.stringify(data),
			});
			if (response.ok) {
				console.log('Request succeeded with response:', response);
				await getDocuments()
			} else {
				console.error('Request failed with status:', response.status);
			}
		} catch (error) {
			console.error('Request failed with error:', error);
		}
	}
	return (
		<div className={`${styles['card']} ${styles['new-card']}`}>
			<h2 className={styles['card-title']}>Add new document</h2>
			<form onSubmit={onSubmit}>
				<input className={`${styles['input-title']} ${styles['input']}`} type="text" name="title" placeholder="Title"/>
				<input className={`${styles['input-text']} ${styles['input']}`} type="text" name="text" placeholder="Text"/>
				<button className={styles['submit']} type="submit">Submit</button>
			</form>
		</div>
	)
}

function Card({title, text}) {
	return (
		<div className={styles['card']}>
			<h2 className={styles['card-title']}>{title}</h2>
			<p className={styles['card-text']}>{text}</p>
		</div>
	)
}

export default function Home() {
	let [documents, setDocuments] = useState([])
	async function getDocuments() {
		try {
			const response = await fetch('http://localhost:8000/get_documents', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				const data = await response.json()
				if (data.document_list.length > documents.length) {
					setDocuments(data.document_list)
				}
			} else {
				console.error('Request failed with status:', response.status);
			}
		} catch (error) {
			console.error('Request failed with error:', error);
		}
	}
	getDocuments()
	return (
		<>
			<h1  className={styles['page-title']}>Tada</h1>
			<main className={styles['cards-container']}>
				<CreateNewDocument getDocuments={getDocuments}/>
				{
					documents.map((document, key) => {
						return <Card key={key} title={document.title} text={document.text}/>
					})
				}
			</main>
		</>
	)
}