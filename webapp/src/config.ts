interface IFile {
    mtime: string
    name: string
    size: number
    type: 'file'
}

export type TConfig = 'OFF' | 'RR' | 'RY' | 'RG' | 'YR' | 'YY' | 'YG' | 'GR' | 'GY' | 'GG'

export type IConfiguration = Record<TConfig, string>

export const defaultConfiguration: IConfiguration = {
    /* eslint-disable @typescript-eslint/naming-convention */
    GG: '',
    GR: '',
    GY: '',
    OFF: 'Ausschalten',
    RG: '',
    RR: '',
    RY: '',
    YG: '',
    YR: '',
    YY: '',
    /* eslint-enable @typescript-eslint/naming-convention */
}

export function httpGet<T>(uri: string, json = true): Promise<T> {
    return new Promise<T>((success, failure) => {
        try {
            const req = new XMLHttpRequest()

            req.onload = () => {
                try {
                    if (req.status === 200) {
                        success(json ? JSON.parse(req.responseText) : req.responseText)
                    } else {
                        failure(req.statusText)
                    }
                } catch (error) {
                    failure(error)
                }
            }

            req.onerror = failure
            req.ontimeout = failure

            req.open('GET', uri)

            req.withCredentials = true

            req.send()
        } catch (error) {
            failure(error)
        }
    })
}

export async function loadConfig(): Promise<IConfiguration> {
    const files = await httpGet<IFile[]>('/config')

    let latest: IFile = undefined

    for (const file of files || []) {
        if (file.type === 'file') {
            if (!latest) {
                latest = file
            } else {
                const lTime = new Date(latest.mtime)
                const fTime = new Date(file.mtime)

                if (fTime.getTime() >= lTime.getTime()) {
                    latest = file
                }
            }
        }
    }

    const config = latest && (await httpGet<IConfiguration>(`/config/${latest.name}`))

    return { ...defaultConfiguration, ...config }
}
