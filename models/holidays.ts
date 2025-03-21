import { Schema, Document, model } from 'mongoose';


interface HolidaysSchemaType {
	holidays: string;
}

const HolidaysSchema = new Schema({
	holidays: {
		type: String,
		required: true,
	}
}, { timestamps: true });

const Holidays = model('Holidays', HolidaysSchema);

export default Holidays;
