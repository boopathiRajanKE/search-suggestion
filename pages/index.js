import * as React from "react"
import fetch from "isomorphic-unfetch"
import { debounce, textHighLighter } from "../utils"
import { searchIcon, closeIcon } from "../assets/icons"

function Index(props) {
  const [inputValue, setInputValue] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [mount, setMount] = React.useState(false)
  const [dataResponse, setDataResponse] = React.useState({
    data: [],
    ok: false,
  })
  const [cursor, setCursor] = React.useState(0)

  const inputRef = React.useRef(null)

  const onInputChange = React.useCallback(() => {
    setInputValue(inputRef.current.value)
  }, [])

  const onInputChange2 = React.useCallback(
    debounce(() => {
      setSearchTerm(inputRef.current.value)
    }, 250),
    []
  )

  const onCloseClick = React.useCallback(() => {
    setInputValue("")
    setDataResponse({})
    setCursor(0)
  }, [])

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "ArrowUp" && cursor > 0) {
        setCursor((prevCursor) => prevCursor - 1)
      } else if (
        e.key === "ArrowDown" &&
        cursor < dataResponse.data.length - 1
      ) {
        setCursor((prevCursor) => prevCursor + 1)
      }
      document.querySelector(".sr-item-block.active") &&
        document.querySelector(".sr-item-block.active").scrollIntoViewIfNeeded()
    },
    [dataResponse.data, cursor]
  )

  const onMouseEnterItem = (e) => {
    console.log("set")
    const value = e.target.getAttribute("index")
    if (value !== null) setCursor(+value)
  }

  React.useEffect(() => {
    setMount(true)
  }, [])

  React.useEffect(() => {
    document.onkeydown = handleKeyDown
  }, [handleKeyDown])

  React.useEffect(() => {
    if (mount) {
      if (searchTerm !== "") {
        let response = []
        fetch(`http://localhost:3000/api/data/${searchTerm}`)
          .then((response) => response.json())
          .then((response) => {
            setDataResponse(response)
          })
      } else {
        setDataResponse({})
      }
    }
  }, [searchTerm])

  const renderListItem = (item, index) => {
    const { id = "", name = "", items = "", address = "" } = item
    const hasItem = items.some((item) => item.indexOf(searchTerm) !== -1)

    const renderHtml = (className, value) => (
      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html: textHighLighter(value, searchTerm),
        }}
      />
    )

    return (
      <li
        key={`item-${index}`}
        index={index}
        onMouseEnter={onMouseEnterItem}
        className={`sr-item-block ${cursor === index ? "active" : ""}`}
      >
        {renderHtml("sr-item-id", id)}
        {renderHtml("sr-item-name", name)}

        {hasItem && (
          <div className="sr-item-item">"{searchTerm}" found in items</div>
        )}
        {renderHtml("sr-item-addr", address)}
      </li>
    )
  }

  return (
    <div className="sr-assignment">
      <div className={`sr-wrapper ${inputValue !== "" ? "text" : ""}`}>
        <div className="sr-input-block">
          {searchIcon()}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={() => {
              onInputChange()
              onInputChange2()
            }}
            placeholder="Search users by ID, address, name, list"
            className="sr-input-element"
          ></input>
          {closeIcon(onCloseClick)}
        </div>
        {inputValue !== "" && dataResponse.ok === true && (
          <div className="sr-list-item-wrapper">
            {dataResponse.error && (
              <div className="sr-error-text">{dataResponse.error}</div>
            )}
            {dataResponse.data && dataResponse.data.length > 0 && (
              <ul className="sr-list-item-block">
                {dataResponse.data.map(renderListItem)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
