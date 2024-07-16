import { Input } from '@cogoport/components';
import React from 'react';
import { Controller } from 'react-hook-form';

function InputController(props) {
	const {
		name, control, value, rules, ...rest
	} = props;

	return (
		<Controller
			key={name}
			control={control}
			name={name}
			defaultValue={value}
			rules={rules}
			render={({ field: { onChange, onBlur, value: newValue } }) => (
				<Input
					{...rest}
					id={name}
					key={rest.id}
					onChange={(e) => {
						if (typeof rest?.onChange === 'function') {
							rest?.onChange(e, name);
						}
						onChange(e);
					}}
					value={newValue || ''}
					onBlur={(event) => {
						onBlur(event);
						if (typeof rest?.onBlur === 'function') {
							rest?.onBlur(event);
						}
					}}
				/>
			)}
		/>
	);
}
export default InputController;