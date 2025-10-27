export interface ICategory{
	_id: string;
	name: string;
	game: Igames[]

}
export interface Igames{
	_id: string;
	title: string;
	description: string;
	category: string;
	language: string;
	age: string;
	players: string;
	img: string;
}