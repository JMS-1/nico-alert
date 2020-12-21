import classNames from 'classnames'
import * as React from 'react'

import { defaultConfiguration, httpGet, IConfiguration, loadConfig, TConfig } from './config'
import styles from './root.module.scss'

interface IRootProps {}

interface IRootState {
    busy: boolean
    config: IConfiguration
}

interface ICommandProps {
    config: IConfiguration
    setBusy(busy: boolean): void
    what: TConfig
}

class Command extends React.PureComponent<ICommandProps> {
    render(): JSX.Element | null {
        const { config, what } = this.props

        const title = config[what] || what

        return (
            <button
                className={classNames(
                    styles.command,
                    (what === 'GR' || what === 'GG' || what === 'GY') && styles.greenBorder,
                    (what === 'RG' || what === 'GG' || what === 'YG') && styles.greenCenter,
                    (what === 'RR' || what === 'GR' || what === 'YR') && styles.redCenter,
                    (what === 'RR' || what === 'RG' || what === 'RY') && styles.redBorder,
                    (what === 'RY' || what === 'GY' || what === 'YY') && styles.yellowCenter,
                    (what === 'YR' || what === 'YG' || what === 'YY') && styles.yellowBorder
                )}
                onClick={this.execute}
            >
                {title}
            </button>
        )
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

        this.state = { ...this.state, busy: false, config: defaultConfiguration }
    }

    render(): JSX.Element {
        const { config } = this.state

        return (
            <div className={classNames(styles.root, this.state.busy && styles.busy)}>
                <h1>Der Nico Alarm</h1>
                <div>
                    <Command config={config} setBusy={this.setBusy} what='OFF' />
                </div>
                <div>
                    <Command config={config} setBusy={this.setBusy} what='RR' />
                    <Command config={config} setBusy={this.setBusy} what='RY' />
                    <Command config={config} setBusy={this.setBusy} what='RG' />
                </div>
                <div>
                    <Command config={config} setBusy={this.setBusy} what='YR' />
                    <Command config={config} setBusy={this.setBusy} what='YY' />
                    <Command config={config} setBusy={this.setBusy} what='YG' />
                </div>
                <div>
                    <Command config={config} setBusy={this.setBusy} what='GR' />
                    <Command config={config} setBusy={this.setBusy} what='GY' />
                    <Command config={config} setBusy={this.setBusy} what='GG' />
                </div>
            </div>
        )
    }

    private readonly setBusy = (busy: boolean): void => this.setState({ busy })

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
