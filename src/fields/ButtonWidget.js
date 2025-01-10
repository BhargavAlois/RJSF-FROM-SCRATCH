
const ButtonWidget = (props) => {
    const field = props.uiField;
    const value = field['ui:options']['value'];
    const onClick = field['ui:options']['onClick'];
    const btnClass = field['classNames'];

    return (
        <div className='text-center'>
        <button type="button" className={btnClass} onClick={onClick}>
            {value || 'Click Me!'}
        </button>
        </div>
    );
};

export default ButtonWidget;