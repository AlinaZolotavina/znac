import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Form from "./Form";
import Input from "./Input";

function AddPhoto() {
    return (
        <section className='add-photo'>
            <Header className='header admin-header'>
                <Navigation
                    className="nav"
                    firstLink='HOME'
                    secondLink='PROFILE'
                    thirdLink='ADD PHOTO'
                />
                <LogoutButton />
            </Header>
            <Form
                title='Add new photo'
                buttonText='Add photo'
            >
                <label className='input dropdown-input'>
                    Download type
                    <input
                        className='input__field'
                        placeholder='Select download type'
                    />
                    <button className='dropdown-btn'/>
                </label>
                <Input 
                    inputLabel='Photo'
                    placeholder='Select image'
                    classname='input__field'
                />
                <Input 
                    inputLabel='Hastags'
                    placeholder='Enter hastags separated by spaces'
                    classname='input__field'
                />
            </Form>
        </section>
    );
}

export default AddPhoto;