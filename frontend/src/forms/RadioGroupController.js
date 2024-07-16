import { RadioGroup } from '@cogoport/components';
import { Controller } from 'react-hook-form';

function RadioGroupController(props) {
	const {
		name, control, rules, value, ...rest
	} = props;

	return (
		<Controller
			key={rest.id}
			control={control}
			name={name}
			defaultValue={value}
			rules={rules}
			render={({ field: { onChange, onBlur, value:newValue } }) => (
				<RadioGroup
					{...rest}
					key={rest.id}
					onChange={(v) => {
						if (typeof rest?.onChange === 'function') {
							rest.onChange(v);
						}
						onChange(v);
					}}
					value={newValue}
					onBlur={onBlur}
				/>
			)}
		/>
	);
}
export default RadioGroupController;