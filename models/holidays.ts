import { Schema, Document, model } from 'mongoose';


export interface HolidaysSchemaType {
	holidays: Date;
	nameOfHoliday: String;
}

const HolidaysSchema = new Schema({
	holidays: {
		type: Date,
		required: true,
		unique: true
	},
	nameOfHoliday: {
		type: String,
	}
}, { timestamps: true });

const Holidays = model<HolidaysSchemaType>('Holidays', HolidaysSchema);

export default Holidays;
