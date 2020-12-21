import classNames from 'classnames'
import * as React from 'react'

import { defaultConfiguration, httpGet, httpPut, IConfiguration, loadConfig, TConfig } from './config'
import styles from './root.module.scss'

interface IRootProps {}

interface IRootState {
    busy: boolean
    config: IConfiguration
    edit: boolean
}

interface ICommandProps {
    config: IConfiguration
    edit: boolean
    setBusy(busy: boolean): void
    what: TConfig
}

class Command extends React.PureComponent<ICommandProps> {
    render(): JSX.Element | null {
        const { config, what, edit } = this.props

        const title = config[what]

        if (!title && !edit) {
            return null
        }

        return (
            <button className={classNames(styles.command, styles[what])} onClick={edit ? undefined : this.execute}>
                {edit ? <input value={config[what] || ''} onChange={this.onChange} /> : title}
            </button>
        )
    }

    private readonly onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.config[this.props.what] = ev.target.value || ''

        this.forceUpdate()
    }

    private execute = async (): Promise<void> => {
        this.props.setBusy(true)

        try {
            await httpGet(`/iot/${this.props.what}`, false)
        } catch (error) {
            alert(error.message || 'Umschaltung nicht möglich')
        } finally {
            this.props.setBusy(false)
        }
    }
}

export class Root extends React.PureComponent<IRootProps, IRootState> {
    constructor(props: Readonly<IRootState>) {
        super(props)

        this.state = { ...this.state, busy: false, config: defaultConfiguration, edit: false }
    }

    render(): JSX.Element {
        const { config, edit } = this.state

        return (
            <div className={classNames(styles.root, this.state.busy && styles.busy)}>
                <h1>
                    <span>Der Nico Alarm</span>
                    <img src={edit ? 'edit-solid.svg' : 'edit-regular.svg'} onClick={this.toggleEdit} />
                    {edit && <img src={'save-solid.svg'} onClick={this.saveConfig} />}
                </h1>
                <div>
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='OFF' />
                </div>
                <div>
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='RR' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='RY' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='RG' />
                </div>
                <div>
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='YR' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='YY' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='YG' />
                </div>
                <div>
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='GR' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='GY' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='GG' />
                </div>
            </div>
        )
    }

    private readonly setBusy = (busy: boolean): void => this.setState({ busy })

    private readonly toggleEdit = (): void => this.setState({ edit: !this.state.edit })

    private readonly saveConfig = async (): Promise<void> => {
        this.setState({ busy: true })

        try {
            await httpPut('/config.json', JSON.stringify(this.state.config))

            this.setState({ edit: false })
        } catch (error) {
            alert(error.message || 'Konfiguration nicht gespeichert')
        } finally {
            this.setState({ busy: false })
        }
    }

    async componentDidMount(): Promise<void> {
        this.setState({ busy: true })

        try {
            this.setState({ config: await loadConfig() })
        } catch (error) {
            alert(error.message || 'Konfiguration nicht gefunden')
        } finally {
            this.setState({ busy: false })
        }
    }
}
