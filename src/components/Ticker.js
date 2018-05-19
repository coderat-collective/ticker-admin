import React from 'react';
import {Button, Card, Confirm, Form, Header, Icon, Input, Label, Modal} from 'semantic-ui-react';
import {deleteTicker, putTicker} from "../api/Ticker";

export default class Ticker extends React.Component {
    constructor(props) {
        super(props);

        this.form = {
            information: {},
        };

        this.state = {
            ticker: {
                id: props.ticker.id || null,
                title: props.ticker.title || '',
                domain: props.ticker.domain || '',
                description: props.ticker.description || '',
                active: props.ticker.active,
                information: props.ticker.information || {
                    author: '',
                    url: '',
                    email: '',
                    twitter: '',
                    facebook: '',
                }
            },
            confirmOpen: false,
            modalOpen: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleInputChange(event, data) {
        const value = data.type === 'checkbox' ? data.checked : data.value;
        const name = data.name;

        if (name !== undefined && value !== undefined) {
            this.form[name] = value;
        }
    }

    handleSubmit(event) {
        if (Object.keys(this.form).length > 0) {
            putTicker(this.form, this.state.ticker.id).then(response => this.setState({ticker: response.data.ticker}));
        }

        this.setState({modalOpen: false});
        event.preventDefault();
    }

    openDeleteModal = () => this.setState({confirmOpen: true});
    handleCancel = () => this.setState({confirmOpen: false});

    closeConfirm = () => {
        this.setState({confirmOpen: false});
    };

    closeModal = () => {
        this.setState({modalOpen: false})
    };

    handleConfirm() {
        deleteTicker(this.state.ticker.id).then(() => {
            if (this.props.reload !== undefined) {
                this.props.reload();
            }
            this.closeConfirm();
        });
    };

    getForm() {
        return (
            <Modal trigger={<Button color='black' icon='edit' content='edit'
                                    onClick={() => this.setState({modalOpen: true})}/>}
                   dimmer='blurring' closeOnRootNodeClick={false} open={this.state.modalOpen} closeIcon
                   onClose={this.closeModal}
                //https://github.com/Semantic-Org/Semantic-UI-React/issues/2558
                   style={{marginTop: '0px !important', marginLeft: 'auto', marginRight: 'auto'}}>
                <Header>Edit {this.state.ticker.title}</Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit} id='editTicker'>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Title'
                                name='title'
                                defaultValue={this.state.ticker.title}
                                onChange={this.handleInputChange}
                            />
                            <Form.Input
                                label='Domain'
                                name='domain'
                                defaultValue={this.state.ticker.domain}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Checkbox
                            toggle
                            label='Active'
                            name='active'
                            defaultChecked={this.state.ticker.active}
                            onChange={this.handleInputChange}
                        />
                        <Form.TextArea
                            label='Description'
                            name='description'
                            rows='5'
                            defaultValue={this.state.ticker.description}
                            onChange={this.handleInputChange}
                        />
                        <Header dividing>Information</Header>
                        <Form.Group widths='equal'>
                            <Form.Input label='Author'>
                                <Input
                                    iconPosition='left'
                                    placeholder='Author' name='information.author'
                                    defaultValue={this.state.ticker.information.author}
                                    onChange={(event, input) => this.form.information.author = input.value}>
                                    <Icon name='users'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Homepage'>
                                <Input
                                    iconPosition='left'
                                    name='information.url'
                                    defaultValue={this.state.ticker.information.url}
                                    onChange={(event, input) => this.form.information.url = input.value}>
                                    <Icon name='home'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input label='Email'>
                                <Input
                                    iconPosition='left'
                                    placeholder='Email' name='information.email'
                                    defaultValue={this.state.ticker.information.email}
                                    onChange={(event, input) => this.form.information.email = input.value}>
                                    <Icon name='at'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Twitter'>
                                <Input
                                    iconPosition='left'
                                    name='information.twitter'
                                    defaultValue={this.state.ticker.information.twitter}
                                    onChange={(event, input) => this.form.information.twitter = input.value}>
                                    <Icon name='twitter'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                            <Form.Input label='Facebook'>
                                <Input
                                    iconPosition='left'
                                    name='information.facebook'
                                    defaultValue={this.state.ticker.information.facebook}
                                    onChange={(event, input) => this.form.information.facebook = input.value}>
                                    <Icon name='facebook'/>
                                    <input/>
                                </Input>
                            </Form.Input>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button type='submit' color='green' content='Save' form='editTicker'/>
                        <Button.Or/>
                        <Button color='red' content='Close' onClick={this.closeModal}/>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        );
    }

    render() {
        return (
            <Card>
                <Card.Content>
                    <Card.Header>
                        <Icon color={this.state.ticker.active ? 'green' : 'red'}
                              name={this.state.ticker.active ? 'toggle on' : 'toggle off'}
                        />
                        {this.state.ticker.title}
                        <Label content={this.state.ticker.id} size='mini' style={{float: 'right'}}/>
                    </Card.Header>
                    <Card.Meta content={this.state.ticker.domain}/>
                    <Card.Description content={this.state.ticker.description}/>
                </Card.Content>
                <Card.Content>
                    <Button.Group size='tiny' fluid compact>
                        <Button color='teal' icon='rocket' content='Use' href={`/ticker/${this.state.ticker.id}`}/>
                        {this.getForm()}
                        <Button color='red' icon='delete' content='Delete' onClick={this.openDeleteModal}/>
                        <Confirm
                            open={this.state.confirmOpen}
                            onCancel={this.handleCancel}
                            onConfirm={this.handleConfirm}
                            dimmer='blurring'
                            size='mini'
                            //https://github.com/Semantic-Org/Semantic-UI-React/issues/2558
                            style={{marginTop: '0px !important', marginLeft: 'auto', marginRight: 'auto'}}
                        />
                    </Button.Group>
                </Card.Content>
            </Card>
        );
    }
}
