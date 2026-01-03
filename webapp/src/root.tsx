import classNames from 'classnames'
import * as React from 'react'

import { defaultConfiguration, httpGet, httpPut, IConfiguration, loadConfig, TConfig } from './config'
import styles from './root.module.scss'

interface IRootProps {}

interface IRootState {
    busy: boolean
    config: IConfiguration
    edit: boolean
    unconfirmed: string
}

interface ICommandProps {
    config: IConfiguration
    edit: boolean
    forceUpdate?(): void
    setBusy(busy: boolean): void
    title?: string
    what: TConfig
}

class Command extends React.PureComponent<ICommandProps> {
    render(): JSX.Element | null {
        const { config, what, edit } = this.props

        const title = this.props.title || config[what]

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
        this.props.forceUpdate?.()
    }

    private execute = async (): Promise<void> => {
        this.props.setBusy(true)

        try {
            const now = new Date()

            const year = `${now.getFullYear()}`
            const month = `${1 + now.getMonth()}`.padStart(2, '0')
            const day = `${now.getDate()}`.padStart(2, '0')
            const hour = `${now.getHours()}`.padStart(2, '0')
            const minute = `${now.getMinutes()}`.padStart(2, '0')
            const second = `${now.getSeconds()}`.padStart(2, '0')

            const time = `${day}.${month}.${year} ${hour}:${minute}:${second}`

            await httpGet(
                `/iot/${this.props.what}?text=${encodeURIComponent(
                    this.props.config[this.props.what]
                )}&time=${encodeURIComponent(time)}`,
                false
            )
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

        this.state = { ...this.state, busy: false, config: defaultConfiguration, edit: false, unconfirmed: '' }
    }

    private _timer?: number

    render(): JSX.Element {
        this.startStatus()

        const { config, edit, unconfirmed } = this.state

        return (
            <div className={classNames(styles.root, this.state.busy && styles.busy, edit && styles.edit)}>
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
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='YR' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='GR' />
                </div>
                <div>
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='RY' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='YY' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='GY' />
                </div>
                <div>
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='RG' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='YG' />
                    <Command config={config} edit={edit} setBusy={this.setBusy} what='GG' />
                </div>
                <div>
                    <Command
                        config={config}
                        edit={true}
                        forceUpdate={this.onUpdate}
                        setBusy={this.setBusy}
                        what='TEXT'
                    />
                    <Command
                        config={config}
                        edit={false}
                        setBusy={this.setBusy}
                        title={config.TEXT && 'Absenden'}
                        what='TEXT'
                    />
                </div>
                <div className={classNames(styles.confirm, unconfirmed && styles.visible)}>
                    Nicht bestätigt: {unconfirmed}
                </div>
                <div />
            </div>
        )
    }

    private readonly onUpdate = (): void => this.forceUpdate()

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

    private startStatus(): void {
        if (this._timer !== undefined) return

        this._timer = window.setTimeout(async () => {
            this._timer = undefined

            try {
                this.setState({ unconfirmed: await httpGet('/iot/STATUS', false) })
            } catch (error) {
                this.setState({ unconfirmed: '' })
            }

            this.startStatus()
        }, 5000)
    }

    componentWillUnmount(): void {
        if (this._timer !== undefined) window.clearTimeout(this._timer)
    }
}
